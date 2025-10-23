import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itineraryId, instruction, currentContent } = body

    if (!itineraryId || !instruction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the existing itinerary
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId }
    })

    if (!existingItinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      )
    }

    // Create a readable stream for SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial response
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', message: 'Refining itinerary...' })}\n\n`))

          // Generate refined itinerary using OpenAI
          const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are an expert travel planner. Refine the existing itinerary based on the user's specific instruction.
                Maintain the overall structure but make the requested changes. Format your response as JSON with two fields:
                - content: The refined itinerary in Markdown format
                - reasoning: A concise explanation of the changes made and why
                
                Consider:
                - The original itinerary context
                - The specific refinement request
                - Maintaining logical flow and timing
                - Budget and practical constraints
                - User preferences from the original request`
              },
              {
                role: 'user',
                content: `Please refine this itinerary based on my request: "${instruction}"

                Original itinerary:
                ${currentContent}

                Please make the requested changes while maintaining the overall quality and structure of the itinerary.`
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
          })

          const response = completion.choices[0]?.message?.content
          if (!response) {
            throw new Error('No response from OpenAI')
          }

          // Parse the JSON response
          let refinedData
          try {
            refinedData = JSON.parse(response)
          } catch {
            // Fallback if response isn't valid JSON
            refinedData = {
              content: response,
              reasoning: 'Refined based on your specific request.'
            }
          }

          // Send the refined content
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: refinedData.content })}\n\n`))
          
          // Send the reasoning
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'reasoning', data: refinedData.reasoning })}\n\n`))

          // Update the database
          await prisma.itinerary.update({
            where: { id: itineraryId },
            data: {
              content: refinedData.content,
              reasoning: refinedData.reasoning
            }
          })

          // Send completion
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`))
          controller.close()

        } catch (error) {
          console.error('Error refining itinerary:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Failed to refine itinerary' })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}

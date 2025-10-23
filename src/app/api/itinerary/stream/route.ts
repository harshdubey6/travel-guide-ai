import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { prisma } from '@/lib/prisma'
import { itineraryFormSchema } from '@/lib/schemas'

export const runtime = 'nodejs' // or 'edge' if your environment supports it

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  const sse = (obj: unknown) =>
    encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)

  const streamError = (message: string, details?: unknown) => {
    console.error(`Itinerary stream error: ${message}`, details)
    return new Response(sse({ type: 'error', message }), {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  }

  // --- Helpers
  const stripFencesIfAny = (text: string) => {
    // Remove ```json ... ``` or ``` ... ``` fences if present
    const fenceRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/i
    const m = text.match(fenceRegex)
    return m ? m[1] : text
  }

  const parseItinerary = (raw: string): { content: string; reasoning: string } => {
    const cleaned = stripFencesIfAny(raw).trim()
    try {
      const parsed = JSON.parse(cleaned)
      if (!parsed || typeof parsed !== 'object') throw new Error('Not an object')
      if (!('content' in parsed) || !('reasoning' in parsed)) throw new Error('Missing fields')
      const { content, reasoning } = parsed as { content?: unknown; reasoning?: unknown }
      if (typeof content !== 'string' || typeof reasoning !== 'string') {
        throw new Error('Invalid field types')
      }
      return { content, reasoning }
    } catch {
      // Fallback: keep text as content
      return {
        content: raw,
        reasoning: 'Generated based on your preferences (response format recovery applied)',
      }
    }
  }

  try {
    // --- Parse JSON body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return streamError('Invalid JSON in request body')
    }

    // --- Validate against schema
    let formData: ReturnType<typeof itineraryFormSchema.parse>
    try {
      formData = itineraryFormSchema.parse(body)
    } catch (e) {
      console.warn('Invalid form data format', e)
      return streamError('Invalid form data format')
    }

    console.log('Processing itinerary request:', {
      destination: formData.destination,
      dates: `${formData.startDate} to ${formData.endDate}`,
      travelers: formData.travelers,
      interests: formData.interests,
    })

    const responseStream = new ReadableStream({
      start(controller) {
        const send = (obj: unknown) => controller.enqueue(sse(obj))
        const ping = () => controller.enqueue(encoder.encode(':\n\n')) // SSE comment heartbeat
        const HEARTBEAT_MS = 15000
        let heartbeat: ReturnType<typeof setInterval> | null = null

        const done = () => {
          if (heartbeat) clearInterval(heartbeat)
          try {
            controller.close()
          } catch {}
        }

        const generate = async () => {
          try {
            // Start + heartbeat
            send({ type: 'start', message: 'Starting itinerary generation...' })
            heartbeat = setInterval(ping, HEARTBEAT_MS)

            // Verify API key before creating client
            const apiKey = process.env.GOOGLE_GEMINI_API_KEY
            if (!apiKey) throw new Error('Gemini API key not configured correctly')

            // Init client lazily with a valid key
            const genAI = new GoogleGenerativeAI(apiKey)

            // Use the free-tier model
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

            const prompt = `You are an expert travel planner specializing in Indian travelers. Create a detailed, day-by-day itinerary for the following trip:

Destination: ${formData.destination}
Dates: ${formData.startDate} to ${formData.endDate}
Budget: ${formData.budget}
Travelers: ${formData.travelers}
Interests: ${formData.interests.join(', ')}
Pace: ${formData.pace}
Mobility: ${formData.mobility || 'No constraints'}
Transport: ${formData.transport || 'Any'}

Format your response as a JSON object with these fields:
1. "content": A detailed markdown-formatted itinerary with day-by-day activities
2. "reasoning": Your planning considerations and recommendations

Consider Indian travel preferences:
- Indian food and vegetarian options
- Visa requirements from India
- Budget in Indian Rupees
- Cultural and spiritual sites
- Shopping and markets
- Family-friendly activities
- Weather preferences
- Flight connectivity from India
- Local Indian communities
- Festivals and events
- Photography spots
- Budget-friendly options

Ensure the response is in valid JSON format.`

            const result = await model.generateContent(prompt)
            const text = result.response.text()

            // Parse or fallback
            const itineraryData = parseItinerary(text)

            // Stream content
            send({ type: 'content', data: itineraryData.content })
            send({ type: 'reasoning', data: itineraryData.reasoning })

            // Persist (non-fatal on error)
            try {
              const itinerary = await prisma.itinerary.create({
                data: {
                  destination: formData.destination,
                  startDate: new Date(formData.startDate),
                  endDate: new Date(formData.endDate),
                  budget: formData.budget,
                  travelers: formData.travelers,
                  interests: JSON.stringify(formData.interests ?? []),
                  pace: formData.pace,
                  mobility: formData.mobility ?? null,
                  transport: formData.transport ?? null,
                  content: itineraryData.content,
                  reasoning: itineraryData.reasoning,
                },
              })
              send({ type: 'complete', itineraryId: itinerary.id })
            } catch (dbError) {
              console.error('Database save failed:', dbError)
              send({ type: 'error', message: 'Failed to save itinerary' })
            }

            done()
          } catch (err) {
            console.error('Error generating itinerary:', err)
            send({
              type: 'error',
              message:
                err instanceof Error ? err.message : 'Failed to generate itinerary',
            })
            done()
          }
        }

        // Fire and forget inside the stream lifecycle
        generate()
      },
    })

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Fatal API Error:', error)
    return streamError('Failed to process request')
  }
}

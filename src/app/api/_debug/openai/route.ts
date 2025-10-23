import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const configured = Boolean(apiKey)
    const length = apiKey ? String(apiKey).length : 0

    return NextResponse.json({ configured, length })
  } catch (err) {
    console.error('OpenAI debug error', err)
    return NextResponse.json({ configured: false }, { status: 500 })
  }
}

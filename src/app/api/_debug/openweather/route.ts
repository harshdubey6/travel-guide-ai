import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 })
    }

    const url = new URL(request.url)
    const city = url.searchParams.get('city') || 'Kathmandu'

    const upstream = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    )

    const text = await upstream.text().catch(() => '<no body>')

    let parsed: unknown = text
    try {
      parsed = JSON.parse(text)
    } catch {
      // keep as text
    }

    return NextResponse.json({ status: upstream.status, body: parsed })
  } catch (err) {
    console.error('Debug route error', err)
    return NextResponse.json({ error: 'Debug request failed' }, { status: 500 })
  }
}


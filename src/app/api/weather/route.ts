import { NextRequest, NextResponse } from 'next/server'
import { WeatherApiResponse, ForecastApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')

    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Weather API key not configured' },
        { status: 500 }
      )
    }

    // Helper: fetch by city q= or by lat/lon depending on args
    async function fetchWeatherByQuery(q: string) {
      return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`)
    }

    async function fetchForecastByQuery(q: string) {
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`)
    }

    async function fetchWeatherByCoords(lat: number, lon: number) {
      return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    }

    async function fetchForecastByCoords(lat: number, lon: number) {
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    }

    // Try direct city query first
    let currentWeatherResponse = await fetchWeatherByQuery(city)
    let forecastResponse = await fetchForecastByQuery(city)

    // If direct query failed (city not found or other non-ok), try geocoding fallback
    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      const attemptGeocode = async (query: string) => {
        try {
          const geo = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`
          )
          if (!geo.ok) return null
          const geoJson = await geo.json()
          if (!Array.isArray(geoJson) || geoJson.length === 0) return null
          const { lat, lon } = geoJson[0]
          return { lat, lon }
        } catch {
          return null
        }
      }

      // First try the full city string
      let coords = await attemptGeocode(city)

      // If that fails and the city contains separators like '&' or ',', try splitting and geocoding the first segment
      if (!coords) {
        const separators = ['&', ',']
        let firstPart = city
        for (const sep of separators) {
          if (city.includes(sep)) {
            firstPart = city.split(sep)[0].trim()
            break
          }
        }
        if (firstPart && firstPart !== city) {
          coords = await attemptGeocode(firstPart)
        }
      }

      if (coords) {
        // Re-run weather/forecast calls with lat/lon
        currentWeatherResponse = await fetchWeatherByCoords(coords.lat, coords.lon)
        forecastResponse = await fetchForecastByCoords(coords.lat, coords.lon)
      } else {
        // Log both original responses for debugging
        const curText = await currentWeatherResponse.text().catch(() => '<no body>')
        const forText = await forecastResponse.text().catch(() => '<no body>')
        console.error('OpenWeather direct query failed and geocoding fallback found no coords', {
          city,
          currentStatus: currentWeatherResponse.status,
          currentBody: curText,
          forecastStatus: forecastResponse.status,
          forecastBody: forText,
        })
        throw new Error(`Failed to resolve city or fetch weather: ${currentWeatherResponse.status}/${forecastResponse.status}`)
      }
    }

    if (!currentWeatherResponse.ok) {
      const text = await currentWeatherResponse.text().catch(() => '<no body>')
      console.error('OpenWeather current weather failed after fallback', {
        status: currentWeatherResponse.status,
        body: text,
      })
      throw new Error(`Failed to fetch current weather: ${currentWeatherResponse.status}`)
    }

    const currentWeather: WeatherApiResponse = await currentWeatherResponse.json()

    if (!forecastResponse.ok) {
      const text = await forecastResponse.text().catch(() => '<no body>')
      console.error('OpenWeather forecast failed after fallback', {
        status: forecastResponse.status,
        body: text,
      })
      throw new Error(`Failed to fetch forecast: ${forecastResponse.status}`)
    }

    const forecastData: ForecastApiResponse = await forecastResponse.json()

    if (!forecastData || !Array.isArray(forecastData.list)) {
      console.error('Forecast response missing list field', { forecastData })
      throw new Error('Invalid forecast data from upstream')
    }

    // Process forecast data
    const forecast = forecastData.list
      .filter((item, index: number) => index % 8 === 0) // Daily forecasts (every 8th item = 24h)
      .slice(0, 5) // Next 5 days
      .map((item) => ({
        date: item.dt_txt.split(' ')[0],
        temperature: {
          min: Math.round(item.main.temp_min),
          max: Math.round(item.main.temp_max)
        },
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: Math.round((item.pop || 0) * 100)
      }))

    const weatherData = {
      city: currentWeather.name,
      country: currentWeather.sys.country,
      current: {
        temperature: Math.round(currentWeather.main.temp),
        description: currentWeather.weather[0].description,
        humidity: currentWeather.main.humidity,
        windSpeed: currentWeather.wind.speed,
        icon: currentWeather.weather[0].icon
      },
      forecast
    }

    return NextResponse.json(weatherData)

  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}

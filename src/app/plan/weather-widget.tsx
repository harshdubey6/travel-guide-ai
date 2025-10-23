'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud, Droplets, Wind } from 'lucide-react'

interface WeatherWidgetProps {
  city: string
  startDate: string
  endDate?: string
}

interface WeatherData {
  city: string
  country: string
  current: {
    temperature: number
    description: string
    humidity: number
    windSpeed: number
    icon: string
  }
  forecast: Array<{
    date: string
    temperature: {
      min: number
      max: number
    }
    description: string
    icon: string
    precipitation: number
  }>
}

export function WeatherWidget({ city, startDate, endDate }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city || !startDate) return

    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams({
          city,
          start: startDate,
          ...(endDate && { end: endDate })
        })

        const response = await fetch(`/api/weather?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const data = await response.json()
        setWeather(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city, startDate, endDate])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || 'Weather data unavailable'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="w-5 h-5 mr-2" />
          Weather Forecast for {weather.city}, {weather.country}
        </CardTitle>
        <CardDescription>
          Current conditions and 5-day forecast
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">
              {weather.current.icon && (
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
                  alt={weather.current.description}
                  className="w-12 h-12"
                />
              )}
            </div>
            <div>
              <div className="text-2xl font-bold">{weather.current.temperature}°C</div>
              <div className="text-sm text-muted-foreground capitalize">
                {weather.current.description}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Droplets className="w-4 h-4" />
              <span>{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Wind className="w-4 h-4" />
              <span>{weather.current.windSpeed} m/s</span>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div>
          <h4 className="text-sm font-medium mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center p-2 bg-muted rounded">
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="text-xs mb-1">
                  {day.icon && (
                    <img 
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                      alt={day.description}
                      className="w-6 h-6 mx-auto"
                    />
                  )}
                </div>
                <div className="text-xs font-medium">
                  {day.temperature.max}°/{day.temperature.min}°
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.precipitation}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

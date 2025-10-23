'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Globe, Clock, Plane, MapPin } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Gradient border */}
      <div className={`absolute inset-x-0 -top-px h-px bg-linear-to-r ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      
      <div className="flex flex-col gap-4">
        {/* Icon */}
        {icon}
        
        {/* Title with gradient on hover */}
        <h3 className={`font-heading text-xl font-semibold bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r ${gradient} transition-colors duration-300`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export function Features() {
  const features = [
    {
      icon: <div className="bg-linear-to-br from-orange-500/20 to-red-500/20 p-3 rounded-xl">
        <Zap className="h-8 w-8 text-orange-500" />
      </div>,
      title: "AI Itinerary Builder",
      description: "Get personalized day-by-day travel plans with Indian preferences, vegetarian food options, and budget-friendly recommendations.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <div className="bg-linear-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-xl">
        <Globe className="h-8 w-8 text-green-500" />
      </div>,
      title: "Indian-Friendly Destinations",
      description: "Discover visa-free countries, Indian restaurants, and destinations popular among Indian travelers with cultural insights.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <div className="bg-linear-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-xl">
        <Clock className="h-8 w-8 text-blue-500" />
      </div>,
      title: "Weather & Festivals",
      description: "Stay informed with weather forecasts and festival calendars to plan your trips around Indian holidays and celebrations.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl">
        <Plane className="h-8 w-8 text-purple-500" />
      </div>,
      title: "Flight & Visa Info",
      description: "Get flight recommendations, visa requirements, and travel documents needed for your destination from India.",
      gradient: "from-purple-500 to-pink-500"
    },
  ]

  return (
    <section className="container py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 text-center mb-16">
        <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Plan Your{' '}
          <span className="bg-linear-to-r from-orange-500 to-green-500 bg-clip-text text-transparent animate-gradient"> 
            Perfect Travel
          </span>
        </h2>
        <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg sm:leading-7">
          Our AI assistant understands Indian travel preferences and helps you create amazing travel experiences with personalized recommendations.
        </p>
      </div>

      <div className="mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}
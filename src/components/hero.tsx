'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plane, MapPin, Calendar, Sparkles, Globe, Clock, Star, Users, Zap, Shield } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950 animate-gradient" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-[64rem] mx-auto space-y-8 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border bg-background/95 backdrop-blur-sm px-4 py-2 text-sm shadow-lg animate-float">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-medium">AI-Powered Travel Planning for Indians</span>
          </div>
          
          {/* Main heading with gradient animation */}
          <div className="space-y-6">
            <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              Your Perfect Trip
              <span className="bg-gradient-to-r from-orange-600 via-green-600 to-orange-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"> 
                Awaits
              </span>
            </h1>
            <p className="max-w-[42rem] mx-auto text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-8">
              Create personalized travel itineraries with AI assistance. Get detailed day-by-day plans, 
              weather forecasts, and expert recommendations tailored for Indian travelers and destinations.
            </p>
          </div>
          
          {/* CTA Buttons with hover effects */}
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105">
              <Link href="/plan">
                <MapPin className="mr-2 h-5 w-5" />
                Plan Your Trip
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold transition-transform hover:scale-105">
              <Link href="/suggested">
                <Calendar className="mr-2 h-5 w-5" />
                Explore Suggestions
              </Link>
            </Button>
          </div>
          
          {/* Stats with hover effects */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Users className="h-4 w-4" />
              <span>Trusted by 50,000+ Indian travelers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-primary">
              <Shield className="h-4 w-4" />
              <span>Visa & Travel Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-20 pointer-events-none">
        <MapPin className="w-24 h-24 text-primary animate-float" />
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-20 pointer-events-none">
        <Plane className="w-24 h-24 text-primary animate-float-delayed" />
      </div>
    </section>
  )
}

export function Features() {
  const features = [
    {
      icon: <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-3 rounded-xl">
        <Zap className="h-8 w-8 text-orange-500" />
      </div>,
      title: "AI Itinerary Builder",
      description: "Get personalized day-by-day travel plans with Indian preferences, vegetarian food options, and budget-friendly recommendations.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-xl">
        <Globe className="h-8 w-8 text-green-500" />
      </div>,
      title: "Indian-Friendly Destinations",
      description: "Discover visa-free countries, Indian restaurants, and destinations popular among Indian travelers with cultural insights.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 rounded-xl">
        <Clock className="h-8 w-8 text-blue-500" />
      </div>,
      title: "Weather & Festivals",
      description: "Stay informed with weather forecasts and festival calendars to plan your trips around Indian holidays and celebrations.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl">
        <Plane className="h-8 w-8 text-purple-500" />
      </div>,
      title: "Flight & Visa Info",
      description: "Get flight recommendations, visa requirements, and travel documents needed for your destination from India.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-3 rounded-xl">
        <MapPin className="h-8 w-8 text-yellow-500" />
      </div>,
      title: "Local Indian Communities",
      description: "Find Indian restaurants, temples, grocery stores, and local Indian communities in your destination.",
      color: "text-red-600"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Cultural Adaptation",
      description: "Get tips on local customs, dress codes, and cultural etiquette to blend in seamlessly with local communities.",
      color: "text-pink-600"
    }
  ]

  return (
    <section className="container py-16 md:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-16">
        <Badge variant="secondary" className="mb-4">
          Features
        </Badge>
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
          Everything You Need for
          <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent"> Perfect Travel</span>
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Our AI-powered platform provides comprehensive travel planning tools tailored for Indian travelers to make your next adventure unforgettable.
        </p>
      </div>
      
      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className={`${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

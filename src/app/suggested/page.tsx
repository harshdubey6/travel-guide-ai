'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Calendar, DollarSign, Clock, Star, Search, Filter } from 'lucide-react'
import { SuggestedTrip } from '@/lib/schemas'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface SuggestedTripsResponse {
  trips: SuggestedTrip[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function SuggestedTripsPage() {
  const router = useRouter()
  const { updateFormData } = useAppStore()
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [tripType, setTripType] = useState('all')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery<SuggestedTripsResponse>({
    queryKey: ['suggested-trips', page, region, tripType, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(region !== 'all' && { region }),
        ...(tripType !== 'all' && { tripType }),
        ...(search && { search })
      })

      const response = await fetch(`/api/suggestions?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }
      return response.json()
    }
  })

  const handleUseAsTemplate = (trip: SuggestedTrip) => {
    // Pre-fill the form with trip data
    let interests: string[] = [];
    
    try {
      // First try to parse as JSON
      const highlights = JSON.parse(trip.highlights);
      if (Array.isArray(highlights)) {
        interests = highlights.slice(0, 3);
      }
    } catch (error) {
      // JSON parsing failed, try string fallback
      if (typeof trip.highlights === 'string') {
        interests = trip.highlights.split(',').map(h => h.trim()).slice(0, 3);
      }
    }
    
    updateFormData({
      destination: trip.destination,
      budget: trip.budget,
      interests: interests
    })
    
    // Navigate to plan page
    router.push('/plan')
  }

  const regions = [
    'all', 'Europe', 'Asia', 'North America', 'South America', 
    'Africa', 'Oceania', 'Central America', 'Middle East'
  ]

  const tripTypes = [
    'all', 'Adventure', 'Cultural', 'Romantic', 'Relaxation', 
    'Family', 'Solo', 'Business', 'Luxury'
  ]

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Suggested Trips</h1>
        <p className="text-muted-foreground">
          Discover amazing destinations and curated travel experiences from around the world.
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r === 'all' ? 'All Regions' : r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tripType} onValueChange={setTripType}>
              <SelectTrigger>
                <SelectValue placeholder="Trip Type" />
              </SelectTrigger>
              <SelectContent>
                {tripTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearch('')
                setRegion('all')
                setTripType('all')
                setPage(1)
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Failed to load suggestions. Please try again.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80">
                      {trip.tripType}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trip.destination}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {trip.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        try {
                          // First try to parse as JSON
                          const highlights = JSON.parse(trip.highlights);
                          if (Array.isArray(highlights)) {
                            return highlights.slice(0, 3).map((highlight: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {highlight}
                              </Badge>
                            ));
                          }
                        } catch (error) {
                          // JSON parsing failed, continue to fallback
                        }
                        
                        // Fallback: treat highlights as a string and split by comma
                        if (typeof trip.highlights === 'string') {
                          const highlights = trip.highlights.split(',').map(h => h.trim());
                          return highlights.slice(0, 3).map((highlight: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ));
                        }
                        
                        // If all else fails, show a default message
                        return (
                          <Badge variant="outline" className="text-xs">
                            Highlights available
                          </Badge>
                        );
                      })()}
                      {(() => {
                        try {
                          // First try to parse as JSON
                          const highlights = JSON.parse(trip.highlights);
                          if (Array.isArray(highlights)) {
                            return highlights.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{highlights.length - 3} more
                              </Badge>
                            );
                          }
                        } catch (error) {
                          // JSON parsing failed, continue to fallback
                        }
                        
                        // Fallback: treat highlights as a string and split by comma
                        if (typeof trip.highlights === 'string') {
                          const highlights = trip.highlights.split(',').map(h => h.trim());
                          return highlights.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{highlights.length - 3} more
                            </Badge>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Best Time</div>
                        <div className="text-muted-foreground">{trip.bestTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Duration</div>
                        <div className="text-muted-foreground">{trip.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Budget</div>
                        <div className="text-muted-foreground">{trip.budget}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Region</div>
                        <div className="text-muted-foreground">{trip.region}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleUseAsTemplate(trip)}
                    className="w-full"
                  >
                    Use as Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

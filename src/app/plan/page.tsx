'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppStore } from '@/lib/store'
import { itineraryFormSchema, type ItineraryFormSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ArrowRight, MapPin, Users, Heart, Zap, Clock } from 'lucide-react'
import { ItineraryResult } from './itinerary-result'
import { WeatherWidget } from './weather-widget'

const INTERESTS = [
  { id: 'food', label: 'Indian Food & Vegetarian Options', icon: '🍽️' },
  { id: 'temples', label: 'Temples & Spiritual Sites', icon: '🕉️' },
  { id: 'shopping', label: 'Shopping & Markets', icon: '🛍️' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌲' },
  { id: 'adventure', label: 'Adventure & Trekking', icon: '🏔️' },
  { id: 'history', label: 'History & Heritage', icon: '🏰' },
  { id: 'beaches', label: 'Beaches & Water Sports', icon: '🏖️' },
  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
  { id: 'photography', label: 'Photography & Instagram Spots', icon: '📸' },
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: '🧘' },
  { id: 'family', label: 'Family-Friendly Activities', icon: '👨‍👩‍👧‍👦' },
  { id: 'budget', label: 'Budget-Friendly Options', icon: '💰' }
]

const PACE_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', description: 'Take it easy with plenty of downtime' },
  { value: 'normal', label: 'Normal', description: 'Balanced mix of activities and rest' },
  { value: 'packed', label: 'Packed', description: 'Maximum activities and experiences' }
]

export default function PlanPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [itineraryResult, setItineraryResult] = useState<{
    id: string
    content: string
    reasoning: string
    formData: {
      destination: string
      startDate: string
      endDate: string
      budget: string
      travelers: number
      pace: string
    }
    createdAt: Date
  } | null>(null)
  const [reasoningTrace, setReasoningTrace] = useState<string[]>([])
  
  const { currentFormData, updateFormData, setCurrentItinerary } = useAppStore()

  const form = useForm<ItineraryFormSchema>({
    resolver: zodResolver(itineraryFormSchema),
    defaultValues: {
      destination: currentFormData.destination || '',
      startDate: currentFormData.startDate || '',
      endDate: currentFormData.endDate || '',
      budget: currentFormData.budget || '',
      travelers: currentFormData.travelers || 1,
      interests: currentFormData.interests || [],
      pace: currentFormData.pace || 'normal',
      mobility: currentFormData.mobility || '',
      transport: currentFormData.transport || ''
    }
  })

  const { watch, setValue, handleSubmit, formState: { errors } } = form
  const watchedValues = watch()

  const steps = [
    { title: 'Destination & Dates', icon: MapPin },
    { title: 'Budget & Group', icon: Users },
    { title: 'Interests & Preferences', icon: Heart },
    { title: 'Review & Generate', icon: Zap }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestChange = (interestId: string, checked: boolean) => {
    const currentInterests = watchedValues.interests || []
    const newInterests = checked
      ? [...currentInterests, interestId]
      : currentInterests.filter(id => id !== interestId)
    
    setValue('interests', newInterests)
    updateFormData({ interests: newInterests })
  }

  const onSubmit = async (data: ItineraryFormSchema) => {
    console.log('Form submission started with data:', {
      destination: data.destination,
      dates: `${data.startDate} to ${data.endDate}`,
      budget: data.budget,
      travelers: data.travelers,
      interests: data.interests,
      pace: data.pace,
      mobility: data.mobility || 'None',
      transport: data.transport || 'None'
    })

    setIsGenerating(true)
    setReasoningTrace([])
    setItineraryResult(null)
    
    updateFormData(data)
    setCurrentItinerary(null)
    console.log('Store updated, starting API request...')

    try {
      console.log('Making API request to /api/itinerary/stream...')
      const response = await fetch('/api/itinerary/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      console.log('API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        throw new Error(`Failed to generate itinerary: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')
      console.log('Stream reader obtained, starting to process chunks...')

      let content = ''
      let reasoning = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              console.log('Received SSE data:', data.type)
              switch (data.type) {
                case 'start':
                  console.log('Generation started:', data.message)
                  setReasoningTrace(prev => [...prev, data.message])
                  break
                case 'content':
                  console.log('Received itinerary content length:', data.data.length)
                  content = data.data
                  break
                case 'reasoning':
                  console.log('Received planning reasoning')
                  reasoning = data.data
                  setReasoningTrace(prev => [...prev, 'Planning considerations: ' + data.data])
                  break
                case 'complete':
                  console.log('Generation completed, itinerary ID:', data.itineraryId)
                  const result = {
                    id: data.itineraryId,
                    content,
                    reasoning,
                    formData: data,
                    createdAt: new Date()
                  }
                  setItineraryResult(result)
                  setCurrentItinerary(result)
                  break
                case 'error':
                  console.error('Received error from stream:', data.message)
                  throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating itinerary:', {
        error,
        message: (error as Error).message,
        stack: (error as Error).stack
      })
      setReasoningTrace(prev => [...prev, 'Error: ' + (error as Error).message])
    } finally {
      console.log('Generation process completed, isGenerating set to false')
      setIsGenerating(false)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plan Your Perfect Trip</h1>
                <p className="text-muted-foreground">
                  Tell us about your travel preferences and we&apos;ll create a personalized itinerary just for you.
                </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index + 1 === currentStep
            const isCompleted = index + 1 < currentStep
            
            return (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive ? 'border-primary bg-primary text-primary-foreground' :
                  isCompleted ? 'border-primary bg-primary text-primary-foreground' :
                  'border-muted-foreground text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <Separator className="w-8 mx-4 hidden sm:block" />
                )}
              </div>
            )
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 mr-2" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Where would you like to go and when?"}
              {currentStep === 2 && "Tell us about your budget and travel group."}
              {currentStep === 3 && "What interests you most during your travels?"}
              {currentStep === 4 && "Review your preferences and generate your itinerary."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Destination & Dates */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    {...form.register('destination')}
                    onChange={(e) => {
                      form.setValue('destination', e.target.value)
                      updateFormData({ destination: e.target.value })
                    }}
                  />
                  {errors.destination && (
                    <p className="text-sm text-destructive mt-1">{errors.destination.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...form.register('startDate')}
                      onChange={(e) => {
                        form.setValue('startDate', e.target.value)
                        updateFormData({ startDate: e.target.value })
                      }}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-destructive mt-1">{errors.startDate.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...form.register('endDate')}
                      onChange={(e) => {
                        form.setValue('endDate', e.target.value)
                        updateFormData({ endDate: e.target.value })
                      }}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-destructive mt-1">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                {watchedValues.destination && watchedValues.startDate && (
                  <WeatherWidget 
                    city={watchedValues.destination}
                    startDate={watchedValues.startDate}
                    endDate={watchedValues.endDate}
                  />
                )}
              </div>
            )}

            {/* Step 2: Budget & Group */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget">Budget Range (per person)</Label>
                  <Select
                    value={watchedValues.budget}
                    onValueChange={(value) => {
                      setValue('budget', value)
                      updateFormData({ budget: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                      <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="1l-2l">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="2l-5l">₹2,00,000 - ₹5,00,000</SelectItem>
                      <SelectItem value="5l-plus">₹5,00,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <p className="text-sm text-destructive mt-1">{errors.budget.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    max="20"
                    {...form.register('travelers', { valueAsNumber: true })}
                    onChange={(e) => {
                      form.setValue('travelers', parseInt(e.target.value))
                      updateFormData({ travelers: parseInt(e.target.value) })
                    }}
                  />
                  {errors.travelers && (
                    <p className="text-sm text-destructive mt-1">{errors.travelers.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mobility">Mobility Considerations (Optional)</Label>
                  <Textarea
                    id="mobility"
                    placeholder="e.g., wheelchair accessible, walking difficulties, etc."
                    {...form.register('mobility')}
                    onChange={(e) => {
                      form.setValue('mobility', e.target.value)
                      updateFormData({ mobility: e.target.value })
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="transport">Preferred Transportation (Optional)</Label>
                  <Select
                    value={watchedValues.transport}
                    onValueChange={(value) => {
                      setValue('transport', value)
                      updateFormData({ transport: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Transportation</SelectItem>
                      <SelectItem value="rental-car">Rental Car</SelectItem>
                      <SelectItem value="taxi-ride">Taxi/Rideshare</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="any">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Interests & Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">What interests you most?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {INTERESTS.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest.id}
                          checked={watchedValues.interests?.includes(interest.id) || false}
                          onCheckedChange={(checked) => 
                            handleInterestChange(interest.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={interest.id} className="text-sm font-normal cursor-pointer">
                          <span className="mr-2">{interest.icon}</span>
                          {interest.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.interests && (
                    <p className="text-sm text-destructive mt-1">{errors.interests.message}</p>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">Travel Pace</Label>
                  <RadioGroup
                    value={watchedValues.pace}
                    onValueChange={(value) => {
                      setValue('pace', value as 'relaxed' | 'normal' | 'packed')
                      updateFormData({ pace: value as 'relaxed' | 'normal' | 'packed' })
                    }}
                    className="space-y-3"
                  >
                    {PACE_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 4: Review & Generate */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trip Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination:</span>
                        <span className="font-medium">{watchedValues.destination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dates:</span>
                        <span className="font-medium">
                          {watchedValues.startDate} - {watchedValues.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travelers:</span>
                        <span className="font-medium">{watchedValues.travelers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">{watchedValues.budget}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pace:</span>
                        <span className="font-medium capitalize">{watchedValues.pace}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interests:</span>
                        <span className="font-medium">{watchedValues.interests?.length || 0} selected</span>
                      </div>
                      {watchedValues.mobility && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mobility:</span>
                          <span className="font-medium text-sm">{watchedValues.mobility}</span>
                        </div>
                      )}
                      {watchedValues.transport && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transport:</span>
                          <span className="font-medium">{watchedValues.transport}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating your personalized itinerary...</span>
                    </div>
                    <div className="space-y-2">
                      {reasoningTrace.map((trace, index) => (
                        <div key={index} className="text-sm text-muted-foreground bg-muted p-2 rounded">
                          {trace}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      {itineraryResult && (
        <ItineraryResult 
          itinerary={itineraryResult}
          onRefine={(instruction) => {
            // Handle refinement logic here
            console.log('Refine with:', instruction)
          }}
        />
      )}
    </div>
  )
}

'use client'

import { TripSummary } from '@/components/itinerary/trip-summary'
import { ItineraryResponse } from '@/components/itinerary/itinerary-response'
import { RefinementInput } from '@/components/itinerary/refinement-input'
import { ExportOptions } from '@/components/itinerary/export-options'

interface ItineraryFormData {
  destination: string
  startDate: string
  endDate: string
  budget: string
  travelers: number
  pace: string
}

interface ItineraryResultProps {
  itinerary: {
    id: string
    content: string
    reasoning: string
    formData: ItineraryFormData
    createdAt: Date
  }
  onRefine: (instruction: string) => Promise<void>
}

export function ItineraryResult({ itinerary, onRefine }: ItineraryResultProps) {
  return (
    <div className="mt-8 space-y-6">
      <TripSummary
        destination={itinerary.formData.destination}
        startDate={itinerary.formData.startDate}
        endDate={itinerary.formData.endDate}
        travelers={itinerary.formData.travelers}
        budget={itinerary.formData.budget}
        pace={itinerary.formData.pace}
      />

      <ItineraryResponse content={itinerary.content} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RefinementInput onRefine={onRefine} />
          <ExportOptions 
            itineraryId={itinerary.id} 
            destination={itinerary.formData.destination}
          />
        </div>
      </div>
    </div>
  )
}

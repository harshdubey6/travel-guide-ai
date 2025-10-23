'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Users, DollarSign, RefreshCw } from 'lucide-react'

interface TripSummaryProps {
  destination: string
  startDate: string
  endDate: string
  travelers: number
  budget: string
  pace: string
}

export function TripSummary({ destination, startDate, endDate, travelers, budget, pace }: TripSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <MapPin className="w-5 h-5 mr-2" />
          {destination} Trip Summary
        </CardTitle>
        <CardDescription className="text-base">
          Your personalized itinerary is ready!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryItem
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            label="Dates"
            value={startDate && endDate ? `${startDate} - ${endDate}` : 'Not specified'}
          />
          <SummaryItem
            icon={<Users className="w-4 h-4 text-muted-foreground" />}
            label="Travelers"
            value={typeof travelers === 'number' ? travelers.toString() : 'Not specified'}
          />
          <SummaryItem
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            label="Budget"
            value={budget || 'Not specified'}
          />
          <SummaryItem
            icon={<RefreshCw className="w-4 h-4 text-muted-foreground" />}
            label="Pace"
            value={pace || 'Not specified'}
            capitalize
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface SummaryItemProps {
  icon: React.ReactNode
  label: string
  value: string
  capitalize?: boolean
}

function SummaryItem({ icon, label, value, capitalize = false }: SummaryItemProps) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className={`text-sm text-muted-foreground ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </div>
      </div>
    </div>
  )
}
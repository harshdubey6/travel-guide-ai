'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

interface PlanningNotesProps {
  reasoning: string
}

export function PlanningNotes({ reasoning }: PlanningNotesProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Planning Notes
        </CardTitle>
        <CardDescription className="text-base">
          AI reasoning behind the itinerary decisions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg border border-muted-foreground/20">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{reasoning}</p>
        </div>
      </CardContent>
    </Card>
  )
}
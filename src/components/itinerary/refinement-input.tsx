'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Edit3, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface RefinementInputProps {
  onRefine: (instruction: string) => Promise<void>
}

export function RefinementInput({ onRefine }: RefinementInputProps) {
  const [input, setInput] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const handleRefine = async () => {
    if (!input.trim()) return
    
    setIsRefining(true)
    try {
      await onRefine(input)
      setInput('')
    } finally {
      setIsRefining(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Edit3 className="w-5 h-5 mr-2" />
          Refine Your Itinerary
        </CardTitle>
        <CardDescription className="text-base">
          Make specific changes to your itinerary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., Add a food tour on day 2, Swap the museum visit for a nature walk, Add more time for shopping..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <Button 
          onClick={handleRefine} 
          disabled={!input.trim() || isRefining}
          className="w-full"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Refine Itinerary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Calendar } from 'lucide-react'

interface ExportOptionsProps {
  itineraryId: string
  destination: string
}

export function ExportOptions({ itineraryId, destination }: ExportOptionsProps) {
  const handleExportMarkdown = async () => {
    try {
      const response = await fetch('/api/export/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${destination}-itinerary.md`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleExportICS = async () => {
    try {
      const response = await fetch('/api/export/ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${destination}-itinerary.ics`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Download className="w-5 h-5 mr-2" />
          Export Your Itinerary
        </CardTitle>
        <CardDescription className="text-base">
          Download your itinerary in different formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExportMarkdown} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export as Markdown
          </Button>
          <Button onClick={handleExportICS} variant="outline" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Export as Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
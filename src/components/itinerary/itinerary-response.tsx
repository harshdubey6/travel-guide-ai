'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, MapPin, Users, Wallet, Activity } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ItineraryResponseProps {
  content: string
}

export function ItineraryResponse({ content }: ItineraryResponseProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Clock className="h-6 w-6 text-primary" />
            Your Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Detailed day-by-day plan for your trip, including recommendations and important information.
          </p>
        </CardContent>
      </Card>

      {/* Markdown Content */}
      <Card className="overflow-hidden">
        <ScrollArea className="h-[800px] w-full rounded-lg">
          <div className="p-6">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-6 text-3xl font-bold text-primary">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-4 mt-8 text-2xl font-semibold text-foreground">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-6 text-xl font-semibold text-foreground/90">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-7 text-foreground/80">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground/80">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-2 text-foreground/80">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-7">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">{children}</strong>
                ),
                hr: () => (
                  <hr className="my-8 border-t border-border" />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/50 pl-4 italic text-foreground/70">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
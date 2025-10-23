'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'

interface DayByDayItineraryProps {
  content: string
}

export function DayByDayItinerary({ content }: DayByDayItineraryProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Your Itinerary</CardTitle>
        <CardDescription className="text-base">
          Detailed day-by-day plan for your trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown 
            components={{
              // Customize markdown components
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 list-disc pl-5 space-y-2">{children}</ul>,
              li: ({ children }) => <li className="text-base">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic">
                  {children}
                </blockquote>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
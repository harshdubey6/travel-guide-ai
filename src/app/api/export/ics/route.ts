import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { itineraryId } = body

    if (!itineraryId) {
      return NextResponse.json(
        { error: 'Itinerary ID is required' },
        { status: 400 }
      )
    }

    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId }
    })

    if (!itinerary) {
      return NextResponse.json(
        { error: 'Itinerary not found' },
        { status: 404 }
      )
    }

    // Generate ICS content
    const startDate = itinerary.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDate = itinerary.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Travel Guide//Travel Itinerary//EN
BEGIN:VEVENT
UID:${itinerary.id}@ai-travel-guide.com
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${itinerary.destination} Trip
DESCRIPTION:${itinerary.content.replace(/\n/g, '\\n')}
LOCATION:${itinerary.destination}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': `attachment; filename="${itinerary.destination}-itinerary.ics"`
      }
    })

  } catch (error) {
    console.error('Export Error:', error)
    return NextResponse.json(
      { error: 'Failed to export itinerary' },
      { status: 500 }
    )
  }
}

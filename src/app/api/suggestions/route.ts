import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PrismaWhereClause } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const region = searchParams.get('region')
    const tripType = searchParams.get('tripType')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: PrismaWhereClause = {}
    
    if (region && region !== 'all') {
      where.region = region
    }
    
    if (tripType && tripType !== 'all') {
      where.tripType = tripType
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get trips and total count
    const [trips, total] = await Promise.all([
      prisma.suggestedTrip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.suggestedTrip.count({ where })
    ])

    // Parse highlights for each trip
    const tripsWithParsedHighlights = trips.map(trip => ({
      ...trip,
      highlights: JSON.parse(trip.highlights)
    }))

    return NextResponse.json({
      trips: tripsWithParsedHighlights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}

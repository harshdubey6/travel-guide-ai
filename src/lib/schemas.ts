import { z } from 'zod'

export const itineraryFormSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  travelers: z.number().min(1, 'At least 1 traveler is required'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  pace: z.enum(['relaxed', 'normal', 'packed']),
  mobility: z.string().optional(),
  transport: z.string().optional()
})

export type ItineraryFormSchema = z.infer<typeof itineraryFormSchema>

export const suggestedTripSchema = z.object({
  id: z.string(),
  title: z.string(),
  destination: z.string(),
  description: z.string(),
  highlights: z.string(),
  bestTime: z.string(),
  duration: z.string(),
  budget: z.string(),
  tripType: z.string(),
  region: z.string(),
  coverImage: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type SuggestedTrip = z.infer<typeof suggestedTripSchema>

export const weatherSchema = z.object({
  city: z.string(),
  country: z.string(),
  current: z.object({
    temperature: z.number(),
    description: z.string(),
    humidity: z.number(),
    windSpeed: z.number(),
    icon: z.string()
  }),
  forecast: z.array(z.object({
    date: z.string(),
    temperature: z.object({
      min: z.number(),
      max: z.number()
    }),
    description: z.string(),
    icon: z.string(),
    precipitation: z.number()
  }))
})

export type Weather = z.infer<typeof weatherSchema>

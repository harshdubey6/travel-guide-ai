import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItineraryFormData {
  destination: string
  startDate: string
  endDate: string
  budget: string
  travelers: number
  interests: string[]
  pace: 'relaxed' | 'normal' | 'packed'
  mobility: string
  transport: string
}

export interface ItineraryResult {
  id: string
  content: string
  reasoning: string
  formData: ItineraryFormData
  createdAt: Date
}

interface AppState {
  // Itinerary builder state
  currentFormData: Partial<ItineraryFormData>
  currentItinerary: ItineraryResult | null
  isGenerating: boolean
  
  // Actions
  updateFormData: (data: Partial<ItineraryFormData>) => void
  setCurrentItinerary: (itinerary: ItineraryResult | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  resetForm: () => void
}

const initialFormData: Partial<ItineraryFormData> = {
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  travelers: 1,
  interests: [],
  pace: 'normal',
  mobility: '',
  transport: ''
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentFormData: initialFormData,
      currentItinerary: null,
      isGenerating: false,

      updateFormData: (data) => 
        set((state) => ({
          currentFormData: { ...state.currentFormData, ...data }
        })),

      setCurrentItinerary: (itinerary) => 
        set({ currentItinerary: itinerary }),

      setIsGenerating: (isGenerating) => 
        set({ isGenerating }),

      resetForm: () => 
        set({ 
          currentFormData: initialFormData,
          currentItinerary: null,
          isGenerating: false
        })
    }),
    {
      name: 'ai-travel-guide-storage',
      partialize: (state) => ({
        currentFormData: state.currentFormData,
        currentItinerary: state.currentItinerary
      })
    }
  )
)

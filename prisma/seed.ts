import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const suggestedTrips = [
  {
    title: "Dubai Shopping & Adventure",
    destination: "Dubai, UAE",
    description: "Experience luxury shopping, desert safaris, and modern architecture in this Indian-friendly destination with excellent flight connectivity.",
    highlights: JSON.stringify([
      "Burj Khalifa observation deck",
      "Dubai Mall shopping",
      "Desert safari with camel ride",
      "Gold Souk exploration",
      "Jumeirah Beach relaxation",
      "Indian restaurants in Bur Dubai"
    ]),
    bestTime: "November-March",
    duration: "4-5 days",
    budget: "₹80,000-1,20,000",
    tripType: "Luxury",
    region: "Middle East",
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop"
  },
  {
    title: "Singapore Family Fun",
    destination: "Singapore",
    description: "Perfect family destination with theme parks, Indian temples, and excellent vegetarian food options. Visa-free for Indians!",
    highlights: JSON.stringify([
      "Marina Bay Sands SkyPark",
      "Sentosa Island attractions",
      "Sri Mariamman Temple",
      "Little India exploration",
      "Singapore Zoo & Night Safari",
      "Vegetarian restaurants in Little India"
    ]),
    bestTime: "February-April, November-December",
    duration: "4-6 days",
    budget: "₹60,000-90,000",
    tripType: "Family",
    region: "Asia",
    coverImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop"
  },
  {
    title: "Thailand Cultural Journey",
    destination: "Bangkok & Phuket, Thailand",
    description: "Explore ancient temples, enjoy Thai cuisine, and relax on beautiful beaches. Great value for money with visa-on-arrival!",
    highlights: JSON.stringify([
      "Grand Palace & Wat Phra Kaew",
      "Chatuchak Weekend Market",
      "Floating markets tour",
      "Phuket beach relaxation",
      "Thai cooking class",
      "Indian restaurants in Bangkok"
    ]),
    bestTime: "November-February",
    duration: "6-8 days",
    budget: "₹40,000-70,000",
    tripType: "Cultural",
    region: "Asia",
    coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop"
  },
  {
    title: "Maldives Honeymoon Paradise",
    destination: "Maldives",
    description: "Perfect romantic getaway with overwater villas, crystal-clear waters, and world-class resorts. Visa-free for Indians!",
    highlights: JSON.stringify([
      "Overwater villa stay",
      "Snorkeling & diving",
      "Sunset dolphin cruise",
      "Private beach dinner",
      "Spa & wellness treatments",
      "Indian cuisine available"
    ]),
    bestTime: "November-April",
    duration: "4-6 days",
    budget: "₹1,50,000-3,00,000",
    tripType: "Romantic",
    region: "Asia",
    coverImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop"
  },
  {
    title: "Nepal Spiritual Trek",
    destination: "Kathmandu & Pokhara, Nepal",
    description: "Experience spiritual journey with ancient temples, mountain views, and trekking adventures. No visa required for Indians!",
    highlights: JSON.stringify([
      "Pashupatinath Temple",
      "Boudhanath Stupa",
      "Pokhara lake city",
      "Annapurna base camp trek",
      "Traditional Nepali cuisine",
      "Hindu temples & monasteries"
    ]),
    bestTime: "October-November, March-May",
    duration: "7-10 days",
    budget: "₹25,000-45,000",
    tripType: "Adventure",
    region: "Asia",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop"
  }
]

async function main() {
  console.log('Seeding database...')
  
  for (const trip of suggestedTrips) {
    await prisma.suggestedTrip.create({
      data: trip
    })
  }
  
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

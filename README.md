# AI Travel Guide 🌏✈️

An AI-powered travel companion designed specifically for Indian travelers, helping them plan personalized trips with cultural insights and local recommendations.

## Features 🚀

### For Indian Travelers
- 🍽️ **Vegetarian-Friendly**: Restaurant recommendations and food guides
- 🕉️ **Cultural Insights**: Temple locations, prayer rooms, and festival calendars
- 💰 **Budget Planning**: Costs in INR with money-saving tips
- 🎯 **Local Knowledge**: Indian community insights and travel experiences
- 📝 **Visa Information**: Visa requirements and documentation guides

### Smart Planning
- 🤖 **AI Itinerary Builder**: 
  - Personalized day-by-day plans
  - Real-time refinements
  - Cultural preferences integration
  - Weather-aware scheduling
- 🌤️ **Weather Integration**: 
  - Real-time forecasts
  - Season-based recommendations
  - Best time to visit guides
- 📱 **Modern Interface**: 
  - Mobile-first design
  - Dark/light theme
  - Offline access to itineraries
- 📤 **Export Options**: 
  - Calendar integration
  - Markdown export
  - Shareable links

## Tech Stack 💻

### Frontend
- ⚡ Next.js 14 (App Router)
- 📝 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🎯 Shadcn/ui Components
- 🔍 Lucide Icons
- 🌓 Dark/Light theme support

### Backend
- 🚀 Next.js API Routes
- 📊 Prisma ORM
- 🗄️ PostgreSQL Database
- 🔒 Environment variable protection

### AI Integration
- 🤖 OpenAI GPT Models
- 📡 Stream Processing
- 🧠 Context-aware responses
- 🌡️ Weather API integration

### Development Tools
- 📦 PNPM for fast, disk-space efficient package management
- 🧪 ESLint & Prettier
- 🔄 Husky for Git hooks
- 📝 TypeScript for static typing

## Getting Started 🏁

### Prerequisites

- Node.js 18+ 
- PNPM (recommended) or npm
- OpenAI API key
- PostgreSQL database
- OpenWeatherMap API key (optional)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ai-travel-guide.git
   cd ai-travel-guide
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Configure your `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   OPENAI_API_KEY="your_key_here"
   WEATHER_API_KEY="your_key_here"
   ```

4. **Initialize database:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure 📁

```
ai-travel-guide/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   │   ├── itinerary/  # Trip planning endpoints
│   │   │   ├── weather/    # Weather data
│   │   │   └── export/     # Export options
│   │   ├── plan/          # Trip planning pages
│   │   └── suggested/     # Suggested trips
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   └── itinerary/     # Trip planning components
│   └── lib/               # Utilities and helpers
├── prisma/                # Database configuration
├── public/               # Static assets
└── ...config files
```

## Key Features 🔑

### 1. Smart Trip Planning
- AI-powered itinerary generation
- Real-time weather integration
- Cultural preference matching
- Budget optimization

### 2. Indian Travel Focus
- Vegetarian restaurant finder
- Temple and prayer room locator
- Festival calendar integration
- Indian community insights

### 3. Practical Tools
- Visa requirement checker
- Budget calculator in INR
- Weather forecasts
- Export to calendar

### 4. User Experience
- Mobile-first design
- Dark/light theme
- Offline capability
- Fast page loads

## Contributing 🤝

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 👏

- Built with ❤️ for Indian travelers
- Powered by OpenAI's GPT models
- UI components from Shadcn/ui
- Icons from Lucide

## Contact 📧

For support or queries:
- Website: [ai-travel-guide.com](https://ai-travel-guide.com)
- Email: contact@ai-travel-guide.com
- GitHub: [github.com/yourusername/ai-travel-guide](https://github.com/yourusername/ai-travel-guide)

---

Made with ❤️ in India | Next.js + TypeScript + AI
│   │   ├── header.tsx        # Navigation header
│   │   ├── hero.tsx          # Landing page components
│   │   └── providers.tsx     # App providers
│   └── lib/                  # Utilities and configurations
│       ├── prisma.ts         # Database client
│       ├── schemas.ts        # Zod validation schemas
│       └── store.ts          # Zustand store
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts              # Database seeding
└── public/                   # Static assets
```

## Usage

### Creating an Itinerary

1. **Navigate to Plan Trip**: Click "Plan Trip" from the homepage
2. **Fill in Details**: Complete the multi-step form with:
   - Destination and travel dates
   - Budget and group size
   - Interests and preferences
   - Travel pace and constraints
3. **Generate**: Click "Generate Itinerary" to create your personalized plan
4. **Review**: View the detailed itinerary with AI reasoning
5. **Refine**: Make specific changes using the refinement feature
6. **Export**: Download as Markdown or calendar file

### Browsing Suggested Trips

1. **Navigate to Suggested Trips**: Click "Explore Suggestions" from the homepage
2. **Filter & Search**: Use filters for region, trip type, and search terms
3. **Use as Template**: Click "Use as Template" to pre-fill the itinerary builder

## API Endpoints

- `POST /api/itinerary/stream` - Generate itinerary with streaming response
- `POST /api/itinerary/refine` - Refine existing itinerary
- `GET /api/suggestions` - Get paginated trip suggestions
- `GET /api/weather` - Get weather data for destination
- `POST /api/export/markdown` - Export itinerary as Markdown
- `POST /api/export/ics` - Export itinerary as calendar file

## Database Schema

### SuggestedTrip
- Trip suggestions with highlights, budget, and metadata

### Itinerary
- Generated itineraries with content, reasoning, and user preferences

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
# AI Travel Guide 🌏✈️

An AI-powered travel companion designed specifically for Indian travelers, helping them plan personalized trips with cultural insights and local recommendations.

## Features 🚀

### For Indian Travelers
- 🍽️ **Vegetarian-Friendly**: Restaurant recommendations and food guides
- 🕉️ **Cultural Insights**: Temple locations, prayer rooms, and festival calendars
- 💰 **Budget Planning**: Costs in INR with money-saving tips
- 🎯 **Local Knowledge**: Indian community insights and travel experiences

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
- 🗄️ SQLlite Database
- 🔒 Environment variable protection

### AI Integration
- 🤖 Gemini Models
- 📡 Stream Processing
- 🧠 Context-aware responses
- 🌡️ Weather API integration

### Development Tools
- 📦 NPM for fast, disk-space efficient package management
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
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Configure your `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   GOOGLE_GEMINI_API_KEY="your_key_here"
   WEATHER_API_KEY="your_key_here"
   ```

4. **Initialize database:**
   ```bash
   npm prisma generate
   npm prisma db push
   ```

5. **Start development server:**
   ```bash
   npm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure 📁

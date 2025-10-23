// API response types
export interface WeatherApiResponse {
  name: string
  sys: {
    country: string
  }
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

export interface ForecastApiResponse {
  list: Array<{
    dt_txt: string
    main: {
      temp_min: number
      temp_max: number
    }
    weather: Array<{
      description: string
      icon: string
    }>
    pop: number
  }>
}

export interface PrismaWhereClause {
  region?: string
  tripType?: string
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' }
    destination?: { contains: string; mode: 'insensitive' }
    description?: { contains: string; mode: 'insensitive' }
  }>
}

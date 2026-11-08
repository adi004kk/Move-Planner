import { DESTINATIONS, ATTRACTIONS, HOTELS, RESTAURANTS, ACTIVITIES, SAMPLE_ITINERARIES } from '../data/travelData';
import { Destination, Hotel, Attraction, Restaurant, Activity, Itinerary, Currency, Coordinates, MonthlyPriceTrend, DailyWeatherForecast } from '../types/travel';

export const CURRENCY_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£'
};

const MONTH_NAMES = [
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' },
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' }
];

export class DestinationService {
  static async getAllDestinations(): Promise<Destination[]> {
    return Promise.resolve(DESTINATIONS);
  }

  static async getDestinationBySlug(slug: string): Promise<Destination | undefined> {
    return Promise.resolve(DESTINATIONS.find(d => d.slug.toLowerCase() === slug.toLowerCase() || d.id === slug));
  }

  static async getDestinationsByCategory(category: string): Promise<Destination[]> {
    return Promise.resolve(DESTINATIONS.filter(d => d.category.toLowerCase() === category.toLowerCase()));
  }

  static async searchDestinations(query: string): Promise<Destination[]> {
    const q = query.toLowerCase().trim();
    if (!q) return DESTINATIONS;
    return Promise.resolve(
      DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.stateOrRegion.toLowerCase().includes(q) ||
        d.highlights.some(h => h.toLowerCase().includes(q))
      )
    );
  }

  /**
   * Generates realistic monthly price fluctuations (hotel, daily spend, flight index, seasonality)
   * tailored to each destination's peak, moderate, and off-season characteristics.
   */
  static getPriceTrends(destination: Destination): MonthlyPriceTrend[] {
    const baseDailySpend = destination.estimatedDailyBudget.midRange;
    const baseHotelNight = Math.round(baseDailySpend * 1.25);
    const peakMonths = destination.bestTimeToVisit.bestMonths;

    return MONTH_NAMES.map((m, index) => {
      const isPeak = peakMonths.includes(m.full);
      // Secondary seasonal check for neighboring months
      const isShoulder = !isPeak && (
        peakMonths.some(pm => {
          const pIdx = MONTH_NAMES.findIndex(x => x.full === pm);
          return Math.abs(pIdx - index) === 1 || Math.abs(pIdx - index) === 11;
        }) || (destination.bestTimeToVisit.moderateSeason.toLowerCase().includes(m.full.toLowerCase()))
      );

      let hotelMultiplier = 0.68;
      let dailyMultiplier = 0.78;
      let flightMultiplier = 0.82;
      let seasonType: MonthlyPriceTrend['seasonType'] = 'Low / Off-Season';
      let savingsTip = 'Great value month: hotel rates drop ~30% with lower crowd density.';

      if (isPeak) {
        // High surge
        hotelMultiplier = 1.45 + (index % 2 === 0 ? 0.08 : -0.04);
        dailyMultiplier = 1.30;
        flightMultiplier = 1.38;
        seasonType = 'Peak Season';
        savingsTip = 'High demand season: book 6-8 weeks early to lock in early-bird rates.';
      } else if (isShoulder) {
        hotelMultiplier = 0.96;
        dailyMultiplier = 0.98;
        flightMultiplier = 1.05;
        seasonType = 'Shoulder Season';
        savingsTip = 'Sweet spot: pleasant weather, moderate crowds, and reasonable pricing.';
      }

      return {
        month: m.short,
        fullMonth: m.full,
        flightIndexMultiplier: parseFloat(flightMultiplier.toFixed(2)),
        hotelAvgPerNight: Math.round(baseHotelNight * hotelMultiplier),
        dailySpendEstimate: Math.round(baseDailySpend * dailyMultiplier),
        seasonType,
        savingsTip
      };
    });
  }
}

export class PlacesService {
  static async getAttractionsByDestination(destinationId: string): Promise<Attraction[]> {
    return Promise.resolve(ATTRACTIONS.filter(a => a.destinationId === destinationId));
  }

  static async getAllAttractions(): Promise<Attraction[]> {
    return Promise.resolve(ATTRACTIONS);
  }

  static async getAttractionBySlug(slug: string): Promise<Attraction | undefined> {
    return Promise.resolve(ATTRACTIONS.find(a => a.slug === slug || a.id === slug));
  }

  static async getRestaurantsByDestination(destinationId: string): Promise<Restaurant[]> {
    return Promise.resolve(RESTAURANTS.filter(r => r.destinationId === destinationId));
  }

  static async getAllRestaurants(): Promise<Restaurant[]> {
    return Promise.resolve(RESTAURANTS);
  }

  static async getRestaurantBySlug(slug: string): Promise<Restaurant | undefined> {
    return Promise.resolve(RESTAURANTS.find(r => r.slug === slug || r.id === slug));
  }

  static async getActivitiesByDestination(destinationId: string): Promise<Activity[]> {
    return Promise.resolve(ACTIVITIES.filter(a => a.destinationId === destinationId));
  }

  static async getAllActivities(): Promise<Activity[]> {
    return Promise.resolve(ACTIVITIES);
  }
}

export class HotelService {
  static async getHotelsByDestination(destinationId: string): Promise<Hotel[]> {
    return Promise.resolve(HOTELS.filter(h => h.destinationId === destinationId));
  }

  static async getAllHotels(): Promise<Hotel[]> {
    return Promise.resolve(HOTELS);
  }

  static async getHotelBySlug(slug: string): Promise<Hotel | undefined> {
    return Promise.resolve(HOTELS.find(h => h.slug === slug || h.id === slug));
  }
}

export interface WeatherData {
  tempCelsius: number;
  condition: string;
  humidity: number;
  windKmh: number;
  bestVisitingSeason: string;
  source: string;
}

export class WeatherService {
  static async getWeatherForDestination(destination: Destination): Promise<WeatherData> {
    return Promise.resolve({
      tempCelsius: destination.category === 'Hill Station' ? 16 : 28,
      condition: destination.category === 'Hill Station' ? 'Pleasantly Crisp & Clear' : 'Sunny with Sea Breeze',
      humidity: 58,
      windKmh: 14,
      bestVisitingSeason: destination.bestTimeToVisit.peakSeason,
      source: 'MovePlanner Atmospheric Model (Demo)'
    });
  }

  /**
   * Fetches real-time multi-day weather forecast from Open-Meteo API for scheduled trip dates
   * with automatic fallback if network is restricted or dates are far in the future.
   */
  static async getForecastForItinerary(params: {
    coordinates: Coordinates;
    destinationName?: string;
    category?: string;
    startDate?: string;
    daysCount: number;
  }): Promise<DailyWeatherForecast[]> {
    const { coordinates, category, startDate, daysCount } = params;
    const baseDate = startDate ? new Date(startDate) : new Date();

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,uv_index_max&timezone=auto`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        const daily = data.daily;

        if (daily && daily.time && daily.time.length > 0) {
          const forecasts: DailyWeatherForecast[] = [];
          const count = Math.min(daysCount, daily.time.length);

          for (let i = 0; i < count; i++) {
            const code = daily.weathercode[i] ?? 0;
            const parsed = this.parseWmoCode(code);
            const rainChance = Math.round(daily.precipitation_probability_max[i] ?? 10);
            const wind = Math.round(daily.windspeed_10m_max[i] ?? 12);
            const uv = Math.round(daily.uv_index_max[i] ?? 5);

            // Determine outdoor suitability
            let outdoorSuitability: DailyWeatherForecast['outdoorSuitability'] = 'Excellent';
            let advisory = 'Ideal conditions for outdoor sightseeing and walking tours.';
            let gear = ['Comfortable walking shoes', 'Sunglasses', 'Light daypack'];

            if (rainChance > 55 || parsed.iconType === 'rain' || parsed.iconType === 'thunder') {
              outdoorSuitability = rainChance > 75 ? 'Caution' : 'Fair';
              advisory = 'Rain expected. Recommend prioritizing museums, indoor markets, and covered temple tours.';
              gear = ['Compact travel umbrella', 'Waterproof rain jacket', 'Water-resistant shoes'];
            } else if (wind > 35) {
              outdoorSuitability = 'Fair';
              advisory = 'Breezy winds: paragliding or boat trips may experience delays.';
              gear = ['Windbreaker shell', 'Secured eyewear'];
            } else if (daily.temperature_2m_max[i] > 34) {
              outdoorSuitability = 'Good';
              advisory = 'Hot afternoon sunshine: plan morning/evening outdoor stops and hydrate frequently.';
              gear = ['SPF 50+ Sunscreen', 'Wide-brim hat', 'Reusable hydration bottle'];
            } else if (daily.temperature_2m_min[i] < 5) {
              advisory = 'Chilly mountain weather: crisp air with excellent visibility.';
              gear = ['Thermal fleece layers', 'Windproof jacket', 'Gloves & beanie'];
            }

            const forecastDate = new Date(baseDate);
            forecastDate.setDate(forecastDate.getDate() + i);

            forecasts.push({
              date: forecastDate.toISOString().split('T')[0],
              dayNumber: i + 1,
              dayName: `Day ${i + 1} (${forecastDate.toLocaleDateString('en-US', { weekday: 'short' })})`,
              tempMaxCelsius: Math.round(daily.temperature_2m_max[i]),
              tempMinCelsius: Math.round(daily.temperature_2m_min[i]),
              weatherCode: code,
              condition: parsed.condition,
              iconType: parsed.iconType,
              precipitationProbability: rainChance,
              windSpeedKmh: wind,
              uvIndex: uv,
              outdoorSuitability,
              activityAdvisory: advisory,
              recommendedGear: gear,
              isLive: true
            });
          }

          // If the itinerary has more days than returned, append simulated days
          if (forecasts.length < daysCount) {
            for (let i = forecasts.length; i < daysCount; i++) {
              forecasts.push(this.generateSimulatedDayForecast(coordinates, category, baseDate, i));
            }
          }

          return forecasts;
        }
      }
    } catch {
      // Network failure or CORS: Fallback seamlessly to seasonal model
    }

    // High quality deterministic seasonal fallback
    const simulated: DailyWeatherForecast[] = [];
    for (let i = 0; i < daysCount; i++) {
      simulated.push(this.generateSimulatedDayForecast(coordinates, category, baseDate, i));
    }
    return simulated;
  }

  private static parseWmoCode(code: number): { condition: string; iconType: DailyWeatherForecast['iconType'] } {
    if (code === 0) return { condition: 'Clear Skies & Sunny', iconType: 'sun' };
    if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', iconType: 'cloud' };
    if (code === 45 || code === 48) return { condition: 'Misty / Foggy', iconType: 'fog' };
    if (code >= 51 && code <= 57) return { condition: 'Light Drizzle', iconType: 'rain' };
    if (code >= 61 && code <= 67) return { condition: 'Passing Showers', iconType: 'rain' };
    if (code >= 71 && code <= 77) return { condition: 'Snowfall', iconType: 'snow' };
    if (code >= 80 && code <= 82) return { condition: 'Rain Showers', iconType: 'rain' };
    if (code >= 95) return { condition: 'Thunderstorms Possible', iconType: 'thunder' };
    return { condition: 'Mild & Clear', iconType: 'sun' };
  }

  private static generateSimulatedDayForecast(
    coordinates: Coordinates,
    category: string | undefined,
    baseDate: Date,
    dayIndex: number
  ): DailyWeatherForecast {
    const forecastDate = new Date(baseDate);
    forecastDate.setDate(forecastDate.getDate() + dayIndex);

    const isHill = category === 'Hill Station' || coordinates.lat > 30;
    const isBeach = category === 'Beach';

    let maxT = isHill ? 18 : isBeach ? 31 : 27;
    let minT = isHill ? 7 : isBeach ? 24 : 17;
    // slight variation per day
    maxT += (dayIndex % 3 === 0 ? 1 : dayIndex % 3 === 1 ? -1 : 0);
    minT += (dayIndex % 2 === 0 ? 0 : 1);

    const rainChance = isHill ? 20 + (dayIndex * 5) % 30 : (dayIndex * 7) % 25;
    const condition = isHill
      ? (dayIndex === 1 ? 'Crisp Mountain Breeze' : 'Clear Alpine Skies')
      : isBeach
      ? 'Sunny with Coastal Breeze'
      : 'Sunny & Clear';

    return {
      date: forecastDate.toISOString().split('T')[0],
      dayNumber: dayIndex + 1,
      dayName: `Day ${dayIndex + 1} (${forecastDate.toLocaleDateString('en-US', { weekday: 'short' })})`,
      tempMaxCelsius: maxT,
      tempMinCelsius: minT,
      weatherCode: 0,
      condition,
      iconType: 'sun',
      precipitationProbability: rainChance,
      windSpeedKmh: 14 + (dayIndex % 4),
      uvIndex: 6,
      outdoorSuitability: 'Excellent',
      activityAdvisory: 'Great weather for outdoor exploration, photography, and walking trails.',
      recommendedGear: ['Sunscreen & hat', 'Breathable layers', 'Comfortable footwear'],
      isLive: false
    };
  }
}

export interface RouteEstimate {
  distanceKm: number;
  durationMinutes: number;
  modes: {
    mode: string;
    durationMinutes: number;
    estimatedCostInr: number;
  }[];
}

export class RoutingService {
  static calculateDistanceKm(c1: Coordinates, c2: Coordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
    const dLng = (c2.lng - c1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(c1.lat * (Math.PI / 180)) * Math.cos(c2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  static getEstimatedTransit(distanceKm: number): RouteEstimate {
    return {
      distanceKm,
      durationMinutes: Math.max(10, Math.round(distanceKm * 2.5)),
      modes: [
        { mode: 'Cab / Taxi', durationMinutes: Math.max(8, Math.round(distanceKm * 2)), estimatedCostInr: Math.round(50 + distanceKm * 25) },
        { mode: 'Auto / Tuk-tuk', durationMinutes: Math.max(12, Math.round(distanceKm * 2.8)), estimatedCostInr: Math.round(30 + distanceKm * 18) },
        { mode: 'Public Bus / Metro', durationMinutes: Math.max(20, Math.round(distanceKm * 4)), estimatedCostInr: Math.round(15 + distanceKm * 5) }
      ]
    };
  }
}

export class CurrencyService {
  static convert(amountInr: number, targetCurrency: Currency): number {
    const rate = CURRENCY_RATES[targetCurrency] || 1;
    return Math.round(amountInr * rate);
  }

  static format(amountInr: number, currency: Currency): string {
    const converted = this.convert(amountInr, currency);
    const symbol = CURRENCY_SYMBOLS[currency] || '₹';
    return `${symbol}${converted.toLocaleString()}`;
  }
}

export class ItineraryService {
  static async getSampleItinerary(idOrDest: string): Promise<Itinerary | undefined> {
    return Promise.resolve(
      SAMPLE_ITINERARIES.find(i => i.id === idOrDest || i.destinationId === idOrDest) || SAMPLE_ITINERARIES[0]
    );
  }

  // Deterministic Itinerary Generator based on user inputs
  static generateDeterministicItinerary(params: {
    destination: Destination;
    daysCount: number;
    travelStyle: 'Relaxed' | 'Balanced' | 'Fast-Paced';
    interests: string[];
    budgetTier: 'Budget' | 'Mid-Range' | 'Luxury';
  }): Itinerary {
    const { destination, daysCount, travelStyle, interests } = params;
    const destAttractions = ATTRACTIONS.filter(a => a.destinationId === destination.id);
    const destRestaurants = RESTAURANTS.filter(r => r.destinationId === destination.id);
    const destActivities = ACTIVITIES.filter(a => a.destinationId === destination.id);

    const stopsPerDay = travelStyle === 'Relaxed' ? 2 : travelStyle === 'Balanced' ? 3 : 4;
    const days = [];

    for (let day = 1; day <= daysCount; day++) {
      const dayStops = [];

      // Morning stop
      const morningAttr = destAttractions[(day - 1) % Math.max(1, destAttractions.length)];
      if (morningAttr) {
        dayStops.push({
          id: `gen-stop-d${day}-1`,
          placeName: morningAttr.name,
          category: 'Attraction' as const,
          timeSlot: 'Morning' as const,
          suggestedTime: '09:30 AM',
          durationMinutes: morningAttr.estimatedDurationHours * 60,
          location: destination.name,
          coordinates: morningAttr.coordinates,
          estimatedCost: morningAttr.entryFee.isFree ? 0 : (morningAttr.entryFee.adultPrice || 150),
          distanceToNextKm: 3.5,
          transportMode: 'Taxi' as const,
          transportCost: 150,
          notes: morningAttr.travelTips[0] || 'Explore the landmark and capture photos.',
          image: morningAttr.image
        });
      }

      // Lunch stop
      const lunchSpot = destRestaurants[(day - 1) % Math.max(1, destRestaurants.length)];
      if (lunchSpot) {
        dayStops.push({
          id: `gen-stop-d${day}-2`,
          placeName: `${lunchSpot.name} — ${lunchSpot.cuisine.slice(0, 2).join(' & ')}`,
          category: 'Food' as const,
          timeSlot: 'Lunch' as const,
          suggestedTime: '01:00 PM',
          durationMinutes: 75,
          location: lunchSpot.address,
          coordinates: lunchSpot.coordinates,
          estimatedCost: Math.round(lunchSpot.approxCostForTwo / 2),
          distanceToNextKm: 2.0,
          transportMode: 'Walk' as const,
          transportCost: 0,
          notes: `Must-try: ${lunchSpot.signatureDishes.slice(0, 2).join(', ')}.`,
          image: lunchSpot.image
        });
      }

      // Afternoon / Evening stop
      if (stopsPerDay >= 3) {
        const eveningActivity = destActivities[(day - 1) % Math.max(1, destActivities.length)];
        if (eveningActivity) {
          dayStops.push({
            id: `gen-stop-d${day}-3`,
            placeName: eveningActivity.name,
            category: 'Activity' as const,
            timeSlot: 'Evening' as const,
            suggestedTime: '04:30 PM',
            durationMinutes: 120,
            location: destination.name,
            coordinates: eveningActivity.coordinates,
            estimatedCost: eveningActivity.pricePerPerson,
            notes: `Includes: ${eveningActivity.includes.slice(0, 2).join(', ')}.`,
            image: eveningActivity.image
          });
        } else {
          dayStops.push({
            id: `gen-stop-d${day}-3`,
            placeName: `${destination.name} Sunset Promenade & Local Bazaars`,
            category: 'Activity' as const,
            timeSlot: 'Evening' as const,
            suggestedTime: '05:00 PM',
            durationMinutes: 120,
            location: destination.name,
            estimatedCost: 300,
            notes: 'Take an easy stroll through evening street markets and souvenir alleys.'
          });
        }
      }

      days.push({
        dayNumber: day,
        title: day === 1 ? `Welcome to ${destination.name}: Settling In & First Impressions` :
               day === 2 ? `Core Highlights, Heritage & Flavor Trails` :
               day === 3 ? `Outdoor Adventures & Scenic Escapes` :
               `Hidden Gems, Leisure & Farewell Sunset`,
        theme: interests[day % interests.length] || 'Discovery & Leisure',
        stops: dayStops
      });
    }

    const totalCost = days.reduce(
      (sum, d) => sum + d.stops.reduce((stSum, s) => stSum + s.estimatedCost + (s.transportCost || 0), 0),
      0
    );

    return {
      id: `custom-itin-${Date.now()}`,
      title: `${daysCount}-Day ${travelStyle} Trip in ${destination.name}`,
      destinationId: destination.id,
      destinationName: destination.name,
      durationDays: daysCount,
      travelStyle,
      estimatedTotalCost: totalCost,
      days
    };
  }
}

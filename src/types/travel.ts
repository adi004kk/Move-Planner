export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Review {
  id: string;
  targetId: string;
  targetType: 'destination' | 'hotel' | 'attraction' | 'restaurant' | 'guide';
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  travelerType?: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
  monthOfVisit?: string;
  helpfulCount?: number;
  userVotedHelpful?: boolean;
  isDemo?: boolean;
}


export interface Destination {
  id: string;
  slug: string;
  name: string;
  stateOrRegion: string;
  country: string;
  heroImage: string;
  gallery: string[];
  tagline: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: {
    peakSeason: string;
    moderateSeason: string;
    offSeason: string;
    bestMonths: string[];
    weatherSummary: string;
  };
  durationDaysRecommended: string;
  estimatedDailyBudget: {
    budget: number;
    midRange: number;
    luxury: number;
  };
  idealFor: ('Couples' | 'Solo' | 'Family' | 'Adventure' | 'Spiritual' | 'Relaxation' | 'Culture' | 'Foodies' | 'Photography' | 'Nature & Wildlife' | 'Urban & Modern' | 'Shopping' | 'Beach')[];
  category: 'Hill Station' | 'Beach' | 'Heritage & Culture' | 'Spiritual' | 'Adventure' | 'Urban & Modern' | 'Nature & Wildlife';
  rating: number;
  reviewCount: number;
  coordinates: Coordinates;
  languages: string[];
  currencyUsed: string;
  localTransportOptions: string[];
  howToReach: {
    byAir: string;
    byTrain: string;
    byRoad: string;
  };
  localCuisine: string[];
  safetyRating: number; // 1-5
  safetyTips: string[];
  localEtiquette: string[];
  featured?: boolean;
  trending?: boolean;
  monthlyPriceTrends?: MonthlyPriceTrend[];
}

export interface MonthlyPriceTrend {
  month: string; // 'Jan', 'Feb', etc.
  fullMonth: string; // 'January'
  flightIndexMultiplier: number; // e.g. 1.25 (+25% surge)
  hotelAvgPerNight: number; // in INR
  dailySpendEstimate: number; // in INR
  seasonType: 'Peak Season' | 'Shoulder Season' | 'Low / Off-Season';
  savingsTip: string;
}

export interface DailyWeatherForecast {
  date: string;
  dayNumber: number;
  dayName: string; // 'Day 1 (Mon)'
  tempMaxCelsius: number;
  tempMinCelsius: number;
  weatherCode: number;
  condition: string;
  iconType: 'sun' | 'cloud' | 'rain' | 'snow' | 'thunder' | 'fog';
  precipitationProbability: number; // 0-100%
  windSpeedKmh: number;
  uvIndex: number;
  outdoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Caution';
  activityAdvisory: string;
  recommendedGear: string[];
  isLive: boolean;
}

export interface Attraction {
  id: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: 'Monument' | 'Nature' | 'Temple' | 'Viewpoint' | 'Museum' | 'Beach' | 'Market' | 'Adventure' | 'Modern';
  image: string;
  gallery?: string[];
  description: string;
  estimatedDurationHours: number;
  entryFee: {
    isFree: boolean;
    adultPrice?: number;
    childPrice?: number;
    isEstimate: boolean;
  };
  openingHours: string;
  bestVisitingTime: string;
  accessibility: string;
  rating: number;
  reviewCount: number;
  coordinates: Coordinates;
  travelTips: string[];
  nearbyAttractionIds: string[];
  isDemo?: boolean;
}

export interface Hotel {
  id: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  name: string;
  type: 'Luxury Resort' | 'Boutique Hotel' | 'Budget Hotel' | 'Hostel' | 'Heritage Palace' | 'Eco Lodge';
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  originalPricePerNight?: number;
  currency: string;
  locationAddress: string;
  distanceFromCenterKm: number;
  coordinates: Coordinates;
  amenities: string[];
  roomTypes: {
    name: string;
    capacity: string;
    price: number;
    features: string[];
  }[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  familyFriendly: boolean;
  isEstimate: boolean;
}

export interface Restaurant {
  id: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  name: string;
  type: 'Fine Dining' | 'Local Eatery' | 'Cafe' | 'Street Food Stall' | 'Rooftop Bar' | 'Bakery';
  cuisine: string[];
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  approxCostForTwo: number;
  signatureDishes: string[];
  dietaryOptions: ('Vegetarian Friendly' | 'Pure Veg' | 'Vegan Options' | 'Halal' | 'Gluten-Free Options')[];
  address: string;
  openingHours: string;
  coordinates: Coordinates;
  mustTryTip: string;
  isEstimate: boolean;
}

export interface Activity {
  id: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  name: string;
  category: 'Trekking' | 'Water Sports' | 'Cultural' | 'Wildlife Safari' | 'Sightseeing' | 'Culinary' | 'Wellness';
  image: string;
  rating: number;
  reviewCount: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  pricePerPerson: number;
  includes: string[];
  bestSeason: string;
  coordinates: Coordinates;
  isEstimate: boolean;
}

export interface TravelGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Beginner' | 'Budget' | 'Solo Travel' | 'Packing & Gear' | 'Family' | 'Safety' | 'Road Trips';
  author: string;
  publishedDate: string;
  readingTimeMinutes: number;
  coverImage: string;
  summary: string;
  contentSections: {
    heading: string;
    text: string;
    bulletPoints?: string[];
  }[];
  relatedDestinationSlugs: string[];
  tags: string[];
}

export interface ItineraryStop {
  id: string;
  placeId?: string;
  placeName: string;
  category: 'Attraction' | 'Food' | 'Activity' | 'Hotel' | 'Transport' | 'Custom';
  timeSlot: 'Morning' | 'Breakfast' | 'Afternoon' | 'Lunch' | 'Evening' | 'Dinner' | 'Night';
  suggestedTime: string;
  durationMinutes: number;
  location: string;
  coordinates?: Coordinates;
  estimatedCost: number;
  distanceToNextKm?: number;
  transportMode?: 'Walk' | 'Taxi' | 'Metro' | 'Auto-Rickshaw' | 'Bus' | 'Rental Scooter';
  transportCost?: number;
  completed?: boolean;
  notes?: string;
  image?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  date?: string;
  theme: string;
  stops: ItineraryStop[];
  notes?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  destinationId: string;
  destinationName: string;
  durationDays: number;
  travelStyle: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  estimatedTotalCost: number;
  days: ItineraryDay[];
}

export type PackingCategory =
  | 'Documents & IDs'
  | 'Clothing & Footwear'
  | 'Toiletries & Personal Care'
  | 'Electronics & Gadgets'
  | 'Health & Medication'
  | 'Destination Specific'
  | 'Miscellaneous';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  packed: boolean;
  isCustom?: boolean;
  quantity?: number;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destinationName: string;
  destinationId: string;
  startDate: string;
  endDate: string;
  travellers: {
    adults: number;
    children: number;
    type: 'Solo' | 'Couple' | 'Family' | 'Friends';
  };
  totalBudget: number;
  currency: Currency;
  travelStyle: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  transportPreference: string;
  accommodationPreference: string;
  status: 'Planning' | 'Confirmed' | 'Completed';
  coverImage: string;
  itinerary: Itinerary;
  createdAt: string;
  notes?: string;
  packingChecklist?: PackingItem[];
}

export interface ExpenseItem {
  id: string;
  tripId?: string;
  category: 'Transport' | 'Accommodation' | 'Food' | 'Activities' | 'Shopping' | 'Insurance' | 'Emergency' | 'Miscellaneous';
  title: string;
  estimatedAmount: number;
  actualAmount: number;
  paid: boolean;
  notes?: string;
}

export interface UserPreferences {
  name: string;
  email: string;
  homeCity: string;
  preferredCurrency: Currency;
  travelStyle: 'Relaxed' | 'Balanced' | 'Fast-Paced';
  preferredInterests: string[];
  dietaryPreferences: string[];
  accessibilityNeeds: string[];
  isLoggedIn: boolean;
}

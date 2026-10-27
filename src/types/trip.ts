export type BudgetTier = 'budget' | 'moderate' | 'luxury';
export type TravelerType = 'solo' | 'couple' | 'family' | 'friends';
export type TravelPace = 'relaxed' | 'balanced' | 'fast-paced';

export type ActivityCategory =
  | 'attraction'
  | 'dining'
  | 'culture'
  | 'leisure'
  | 'nature'
  | 'shopping'
  | 'transport';

export interface Activity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  time: string;
  title: string;
  category: ActivityCategory;
  description: string;
  locationName: string;
  estimatedDuration: string;
  estimatedCostUsd: number;
  travelTip: string;
  recommendedHighlight: string;
  completed?: boolean;
  notes?: string;
}

export interface DiningSpot {
  name: string;
  type: string;
  specialty: string;
  priceRange: string;
  location?: string;
}

export interface DiningPlan {
  breakfast: DiningSpot;
  lunch: DiningSpot;
  dinner: DiningSpot;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  theme: string;
  areaOrNeighborhood: string;
  activities: Activity[];
  diningHighlights: DiningPlan;
}

export interface BudgetBreakdown {
  totalEstimatedUsd: number;
  targetBudgetUsd: number;
  budgetTier: BudgetTier;
  accommodationUsd: number;
  mealsDiningUsd: number;
  activitiesTicketsUsd: number;
  localTransportUsd: number;
  contingencyUsd: number;
  moneySavingTips: string[];
}

export interface TravelTips {
  localTransport: string;
  etiquetteAndCulture: string;
  bestTimeToVisit: string;
  safetyHealth: string;
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
}

export interface PackingCategory {
  category: string;
  items: PackingItem[];
}

export interface TripItinerary {
  id: string;
  createdAt: string;
  updatedAt: string;
  tripTitle: string;
  destination: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: TravelerType;
  budgetTier: BudgetTier;
  targetBudgetUsd: number;
  pace: TravelPace;
  interests: string[];
  specialPreferences?: string;
  seasonSummary: string;
  summary: string;
  heroImage?: string;
  days: DayPlan[];
  budget: BudgetBreakdown;
  tips: TravelTips;
  packingList: PackingCategory[];
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budgetTier: BudgetTier;
  targetBudgetUsd: number;
  travelers: TravelerType;
  pace: TravelPace;
  interests: string[];
  specialPreferences: string;
}

export interface DestinationPreset {
  id: string;
  name: string;
  country: string;
  tagline: string;
  image: string;
  defaultDurationDays: number;
  recommendedBudgetTier: BudgetTier;
  suggestedBudgetUsd: number;
  popularInterests: string[];
  vibe: string;
}

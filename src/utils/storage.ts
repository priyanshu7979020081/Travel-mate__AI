import { TripItinerary } from '../types/trip';
import { SAMPLE_INITIAL_TRIP } from '../data/presets';

const STORAGE_KEY_SAVED_TRIPS = 'travelmate_saved_trips_v1';
const STORAGE_KEY_ACTIVE_TRIP = 'travelmate_active_trip_v1';

export function getSavedTrips(): TripItinerary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_TRIPS);
    if (!raw) {
      // Seed with sample Kyoto trip
      const initial = [SAMPLE_INITIAL_TRIP];
      localStorage.setItem(STORAGE_KEY_SAVED_TRIPS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_INITIAL_TRIP];
  } catch (e) {
    console.error('Failed to read saved trips from localStorage', e);
    return [SAMPLE_INITIAL_TRIP];
  }
}

export function saveTripToStorage(trip: TripItinerary): void {
  try {
    const current = getSavedTrips();
    const index = current.findIndex((t) => t.id === trip.id);
    let updated: TripItinerary[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = { ...trip, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...trip, updatedAt: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(STORAGE_KEY_SAVED_TRIPS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save trip to localStorage', e);
  }
}

export function deleteTripFromStorage(tripId: string): TripItinerary[] {
  try {
    const current = getSavedTrips();
    const filtered = current.filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY_SAVED_TRIPS, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete trip from localStorage', e);
    return [];
  }
}

export function getActiveTrip(): TripItinerary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_TRIP);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read active trip', e);
  }
  return SAMPLE_INITIAL_TRIP;
}

export function setActiveTrip(trip: TripItinerary): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TRIP, JSON.stringify(trip));
    saveTripToStorage(trip);
  } catch (e) {
    console.error('Failed to write active trip', e);
  }
}

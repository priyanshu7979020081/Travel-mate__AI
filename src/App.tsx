import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ItineraryView } from './components/ItineraryView';
import { BudgetTab } from './components/BudgetTab';
import { PackingTab } from './components/PackingTab';
import { TravelTipsTab } from './components/TravelTipsTab';
import { TripPlannerModal } from './components/TripPlannerModal';
import { SavedTripsModal } from './components/SavedTripsModal';
import { PrintableItinerary } from './components/PrintableItinerary';
import {
  TripItinerary,
  TripFormData,
  DestinationPreset,
} from './types/trip';
import {
  getActiveTrip,
  setActiveTrip,
  getSavedTrips,
  saveTripToStorage,
  deleteTripFromStorage,
} from './utils/storage';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>([]);
  const [activeTrip, setActiveTripState] = useState<TripItinerary | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'packing' | 'tips'>('itinerary');

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [presetForPlanner, setPresetForPlanner] = useState<DestinationPreset | null>(null);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Initialize trips from local storage
  useEffect(() => {
    const loadedTrips = getSavedTrips();
    setSavedTrips(loadedTrips);
    const active = getActiveTrip();
    setActiveTripState(active || loadedTrips[0]);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleUpdateTrip = (updatedTrip: TripItinerary) => {
    setActiveTripState(updatedTrip);
    saveTripToStorage(updatedTrip);
    setSavedTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
  };

  const handleSelectSavedTrip = (trip: TripItinerary) => {
    setActiveTripState(trip);
    setActiveTrip(trip);
    showNotification(`Loaded trip: "${trip.tripTitle}"`);
  };

  const handleDuplicateTrip = (trip: TripItinerary) => {
    const duplicated: TripItinerary = {
      ...trip,
      id: `trip-copy-${Date.now()}`,
      tripTitle: `${trip.tripTitle} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTripToStorage(duplicated);
    setSavedTrips(getSavedTrips());
    showNotification(`Duplicated "${trip.tripTitle}"`);
  };

  const handleDeleteTrip = (tripId: string) => {
    const remaining = deleteTripFromStorage(tripId);
    setSavedTrips(remaining);
    if (activeTrip?.id === tripId && remaining.length > 0) {
      setActiveTripState(remaining[0]);
      setActiveTrip(remaining[0]);
    }
    showNotification('Trip removed from saved vault', 'info');
  };

  const handleImportTrip = (imported: TripItinerary) => {
    saveTripToStorage(imported);
    setSavedTrips(getSavedTrips());
    setActiveTripState(imported);
    setActiveTrip(imported);
    setIsSavedTripsOpen(false);
    showNotification(`Imported trip: "${imported.tripTitle}"`);
  };

  const handleGenerateTrip = async (formData: TripFormData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.itinerary) {
        throw new Error('No itinerary returned from generator');
      }

      const newTrip: TripItinerary = data.itinerary;
      // Set hero image if matched preset
      if (presetForPlanner) {
        newTrip.heroImage = presetForPlanner.image;
      }

      saveTripToStorage(newTrip);
      setActiveTrip(newTrip);
      setActiveTripState(newTrip);
      setSavedTrips(getSavedTrips());
      setIsPlannerOpen(false);
      setPresetForPlanner(null);
      setActiveTab('itinerary');
      showNotification(`Created new personalized itinerary for ${newTrip.destination}!`);
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      alert('Encountered an issue planning your trip. Please try again in a moment.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openPlannerWithPreset = (preset: DestinationPreset) => {
    setPresetForPlanner(preset);
    setIsPlannerOpen(true);
  };

  const openPlannerBlank = () => {
    setPresetForPlanner(null);
    setIsPlannerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPlanner={openPlannerBlank}
        onOpenSavedTrips={() => setIsSavedTripsOpen(true)}
        savedTripsCount={savedTrips.length}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl bg-neutral-900 text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Hero Section & Curated Presets */}
      <HeroSection
        onOpenPlannerWithPreset={openPlannerWithPreset}
        onOpenPlanner={openPlannerBlank}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTrip ? (
          <div>
            {/* View Switcher Tabs (Mobile & Quick Toggle) */}
            <div className="flex md:hidden items-center gap-1 p-1 bg-neutral-200/70 rounded-xl mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'itinerary' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'budget' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Budget
              </button>
              <button
                onClick={() => setActiveTab('packing')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'packing' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Packing
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'tips' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-600'
                }`}
              >
                Guide
              </button>
            </div>

            {/* Active Content View */}
            {activeTab === 'itinerary' && (
              <ItineraryView
                trip={activeTrip}
                onUpdateTrip={handleUpdateTrip}
                onPrint={() => setIsPrintOpen(true)}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTab trip={activeTrip} onUpdateTrip={handleUpdateTrip} />
            )}

            {activeTab === 'packing' && (
              <PackingTab trip={activeTrip} onUpdateTrip={handleUpdateTrip} />
            )}

            {activeTab === 'tips' && <TravelTipsTab trip={activeTrip} />}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 p-8">
            <Compass className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-900">No active itinerary selected</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-6">
              Create a fresh personalized travel plan or choose from one of the curated destinations.
            </p>
            <button
              onClick={openPlannerBlank}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Itinerary</span>
            </button>
          </div>
        )}
      </main>

      {/* Trip Planner Modal */}
      <TripPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => {
          setIsPlannerOpen(false);
          setPresetForPlanner(null);
        }}
        onSubmit={handleGenerateTrip}
        initialPreset={presetForPlanner}
        isLoading={isGenerating}
      />

      {/* Saved Trips Vault Modal */}
      <SavedTripsModal
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        savedTrips={savedTrips}
        activeTripId={activeTrip?.id || ''}
        onSelectTrip={handleSelectSavedTrip}
        onDeleteTrip={handleDeleteTrip}
        onDuplicateTrip={handleDuplicateTrip}
        onImportTrip={handleImportTrip}
        onNewTrip={openPlannerBlank}
      />

      {/* Printable Itinerary / PDF Preview Modal */}
      {activeTrip && (
        <PrintableItinerary
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          trip={activeTrip}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 font-medium text-neutral-800">
            <Compass className="w-4 h-4 text-amber-600" />
            <span>TravelMate AI · Personalized Travel Itinerary Planner</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>Dynamic Cost Calculation</span>
            <span aria-hidden="true">·</span>
            <span>Local Cultural Insights</span>
            <span aria-hidden="true">·</span>
            <span>Offline Saved Trips</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

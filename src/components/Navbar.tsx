import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'itinerary' | 'budget' | 'packing' | 'tips';
  setActiveTab: (tab: 'itinerary' | 'budget' | 'packing' | 'tips') => void;
  onOpenPlanner: () => void;
  onOpenSavedTrips: () => void;
  savedTripsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPlanner,
  onOpenSavedTrips,
  savedTripsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap">
            TravelMate AI
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'itinerary'
                ? 'border-amber-600 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Itinerary
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'budget'
                ? 'border-amber-600 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Budget Breakdown
          </button>
          <button
            onClick={() => setActiveTab('packing')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'packing'
                ? 'border-amber-600 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Packing List
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'tips'
                ? 'border-amber-600 text-neutral-950 font-semibold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Destination Guide
          </button>
          <button
            onClick={onOpenSavedTrips}
            className="cursor-pointer transition-colors pb-1 border-b-2 border-transparent text-neutral-600 hover:text-neutral-900 whitespace-nowrap shrink-0"
          >
            Saved Trips ({savedTripsCount})
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSavedTrips}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 text-xs font-medium border border-neutral-200 rounded-lg"
          >
            Trips ({savedTripsCount})
          </button>
          <button
            onClick={onOpenPlanner}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};

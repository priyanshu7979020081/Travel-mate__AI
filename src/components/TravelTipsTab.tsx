import React from 'react';
import {
  Train,
  HeartHandshake,
  SunMedium,
  ShieldCheck,
  Compass,
  MapPin,
} from 'lucide-react';
import { TripItinerary } from '../types/trip';

interface TravelTipsTabProps {
  trip: TripItinerary;
}

export const TravelTipsTab: React.FC<TravelTipsTabProps> = ({ trip }) => {
  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-950">
              Essential Travel Intelligence: {trip.destination}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Insider knowledge, cultural norms, and local logistics for a smooth voyage.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transit & Navigation */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm mb-3">
              <Train className="w-5 h-5 text-amber-600" />
              <span>Getting Around & Local Transit</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {trip.tips.localTransport}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center gap-2">
            <span className="font-semibold text-neutral-700">Pro Tip:</span>
            <span>Download offline maps & digital transit passes before arrival.</span>
          </div>
        </div>

        {/* Culture & Etiquette */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm mb-3">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
              <span>Culture, Customs & Local Etiquette</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {trip.tips.etiquetteAndCulture}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center gap-2">
            <span className="font-semibold text-neutral-700">Pro Tip:</span>
            <span>Learning basic polite local greetings creates instant warmth.</span>
          </div>
        </div>

        {/* Best Times & Weather */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm mb-3">
              <SunMedium className="w-5 h-5 text-amber-600" />
              <span>Climate, Seasons & Best Windows</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {trip.tips.bestTimeToVisit}
            </p>
            <div className="mt-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700">
              <span className="font-semibold text-neutral-900">Current Trip Window Forecast:</span> {trip.seasonSummary}
            </div>
          </div>
        </div>

        {/* Safety & Health */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm mb-3">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Health, Safety & Emergency Readiness</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {trip.tips.safetyHealth}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center gap-2">
            <span className="font-semibold text-neutral-700">Emergency:</span>
            <span>Keep your hotel card with address in local characters in your pocket.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

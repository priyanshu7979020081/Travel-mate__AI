import React from 'react';
import { Compass, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { POPULAR_PRESETS } from '../data/presets';
import { DestinationPreset } from '../types/trip';

interface HeroSectionProps {
  onOpenPlannerWithPreset: (preset: DestinationPreset) => void;
  onOpenPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPlannerWithPreset,
  onOpenPlanner,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top 2-column Hero grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Headline and Call-to-action */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Next-Generation Travel Planning</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight leading-[1.15] text-balance">
                Tailored day-by-day itineraries, crafted in seconds.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
                Tell us your destination, dates, budget, and travel passions. TravelMate AI builds authentic daily schedules, smart budget breakdowns, local dining spots, and practical packing lists.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenPlanner}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Planning Your Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-xs text-neutral-500 flex items-center gap-2">
                <span>Free to use</span>
                <span aria-hidden="true">·</span>
                <span>Custom budget breakdown</span>
                <span aria-hidden="true">·</span>
                <span>Editable schedule</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden min-h-[300px] lg:min-h-[380px] border border-neutral-200 shadow-sm group">
            <img
              src="/src/assets/images/hero_travel_scenic_1793121352024.jpg"
              alt="Scenic coastal town with cliffside villas"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/25 to-transparent flex flex-col justify-end p-6 text-white">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Curated Wanderlust Inspiration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white text-balance">
                Amalfi Coast & Mediterranean Sun
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 mt-1">
                Lemon orchards, cliffside pastel villas, and azure sea breezes. Click below to load instant destination plans.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Destination Presets Carousel / Grid */}
        <div className="mt-12 pt-8 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                Popular Destination Presets
              </h3>
              <p className="text-xs text-neutral-500">Click any destination to customize dates and launch your itinerary</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onOpenPlannerWithPreset(preset)}
                className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="h-40 relative overflow-hidden bg-neutral-100">
                  <img
                    src={preset.image}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-900 shadow-xs">
                    {preset.vibe}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-950 text-base group-hover:text-amber-700 transition-colors">
                        {preset.name}
                      </h4>
                      <span className="text-xs text-neutral-500">{preset.country}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {preset.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                    <span className="flex items-center gap-1 text-neutral-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {preset.defaultDurationDays} Days
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-neutral-900">
                      ~${preset.suggestedBudgetUsd}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

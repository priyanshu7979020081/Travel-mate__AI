import React, { useState } from 'react';
import { X, Sparkles, MapPin, Calendar, Users, DollarSign, Activity, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { AVAILABLE_INTERESTS } from '../data/presets';
import { BudgetTier, TravelerType, TravelPace, TripFormData, DestinationPreset } from '../types/trip';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TripFormData) => Promise<void>;
  initialPreset?: DestinationPreset | null;
  isLoading: boolean;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPreset,
  isLoading,
}) => {
  const [destination, setDestination] = useState(
    initialPreset ? `${initialPreset.name}, ${initialPreset.country}` : 'Kyoto, Japan'
  );

  // Set default dates to upcoming week
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(defaultStart.getDate() + 14);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + (initialPreset ? initialPreset.defaultDurationDays - 1 : 4));

  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(
    initialPreset?.recommendedBudgetTier || 'moderate'
  );
  const [targetBudgetUsd, setTargetBudgetUsd] = useState<number>(
    initialPreset?.suggestedBudgetUsd || 1500
  );
  const [travelers, setTravelers] = useState<TravelerType>('couple');
  const [pace, setPace] = useState<TravelPace>('balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialPreset?.popularInterests || ['Culture & Heritage', 'Foodie & Culinary', 'Photography & Hidden Gems']
  );
  const [specialPreferences, setSpecialPreferences] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== label));
      }
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!destination.trim()) {
      setFormError('Please enter a destination city or country.');
      return;
    }

    if (end < start) {
      setFormError('End date must be after or on the start date.');
      return;
    }

    if (durationDays > 14) {
      setFormError('Please select a trip duration of 14 days or less for an optimal day-by-day plan.');
      return;
    }

    await onSubmit({
      destination: destination.trim(),
      startDate,
      endDate,
      budgetTier,
      targetBudgetUsd: Number(targetBudgetUsd) || 1500,
      travelers,
      pace,
      interests: selectedInterests,
      specialPreferences: specialPreferences.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Trip Concierge</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-950 mt-0.5">
              Plan Your Personalized Itinerary
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Destination */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Where are you traveling?
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-medium"
              />
            </div>
            {/* Quick destination tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-neutral-500 self-center mr-1">Quick Picks:</span>
              {['Kyoto, Japan', 'Amalfi Coast, Italy', 'Swiss Alps', 'Tokyo, Japan', 'Paris, France', 'Bali, Indonesia'].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setDestination(city)}
                  className="px-2 py-0.5 text-xs bg-neutral-100 hover:bg-amber-50 hover:text-amber-800 text-neutral-700 rounded-md transition-colors cursor-pointer"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:border-amber-600 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                End Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:border-amber-600 font-medium"
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-neutral-600 font-medium bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between">
            <span>Trip Duration:</span>
            <span className="font-semibold text-neutral-900 font-mono tabular-nums">{durationDays} {durationDays === 1 ? 'Day' : 'Days'}</span>
          </div>

          {/* 3. Travelers & Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                <span>Travelers</span>
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-100 rounded-xl">
                {(['solo', 'couple', 'family', 'friends'] as TravelerType[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setTravelers(t)}
                    className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      travelers === t
                        ? 'bg-white text-neutral-950 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-neutral-500" />
                <span>Travel Pace</span>
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl">
                {(['relaxed', 'balanced', 'fast-paced'] as TravelPace[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPace(p)}
                    className={`py-1.5 text-xs font-medium capitalize rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      pace === p
                        ? 'bg-white text-neutral-950 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {p === 'fast-paced' ? 'Intensive' : p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Budget Tier & Target */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                <span>Budget Level & Target</span>
              </label>
              <span className="text-xs text-neutral-500">Excludes international flights</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'budget', label: 'Budget ($)', desc: 'Hostels, local transit & street food' },
                { id: 'moderate', label: 'Moderate ($$)', desc: 'Boutique hotels & mix of dining' },
                { id: 'luxury', label: 'Luxury ($$$)', desc: '5-star stays & fine dining' },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => {
                    setBudgetTier(tier.id as BudgetTier);
                    if (tier.id === 'budget') setTargetBudgetUsd(durationDays * 120);
                    if (tier.id === 'moderate') setTargetBudgetUsd(durationDays * 280);
                    if (tier.id === 'luxury') setTargetBudgetUsd(durationDays * 550);
                  }}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                    budgetTier === tier.id
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-neutral-900">{tier.label}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{tier.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 whitespace-nowrap">Approximate Target (USD):</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-xs font-bold text-neutral-400">$</span>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={targetBudgetUsd}
                  onChange={(e) => setTargetBudgetUsd(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono tabular-nums font-semibold rounded-lg border border-neutral-300 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 5. Interests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-neutral-500" />
              <span>What do you love most when traveling? (Select multiple)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest.label);
                return (
                  <button
                    type="button"
                    key={interest.id}
                    onClick={() => toggleInterest(interest.label)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    {interest.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Special preferences */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Special Preferences, Dietary or Mobility Requests (Optional)
            </label>
            <textarea
              rows={2}
              value={specialPreferences}
              onChange={(e) => setSpecialPreferences(e.target.value)}
              placeholder="e.g. Vegetarian dining preferences, traveling with a toddler, prefers walking over subways..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-amber-600 font-normal"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Curating Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Personalized Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

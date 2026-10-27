import React, { useState } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Hotel,
  Utensils,
  Ticket,
  Train,
  ShieldAlert,
  Edit2,
  Check,
  Lightbulb,
} from 'lucide-react';
import { TripItinerary } from '../types/trip';

interface BudgetTabProps {
  trip: TripItinerary;
  onUpdateTrip: (updatedTrip: TripItinerary) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ trip, onUpdateTrip }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [targetBudget, setTargetBudget] = useState(trip.budget.targetBudgetUsd || 1500);
  const [accommodation, setAccommodation] = useState(trip.budget.accommodationUsd || 600);
  const [meals, setMeals] = useState(trip.budget.mealsDiningUsd || 400);
  const [transport, setTransport] = useState(trip.budget.localTransportUsd || 120);
  const [contingency, setContingency] = useState(trip.budget.contingencyUsd || 100);

  // Recalculate scheduled activities cost directly from itinerary
  const activitiesCost = trip.days
    .flatMap((d) => d.activities)
    .reduce((sum, a) => sum + (Number(a.estimatedCostUsd) || 0), 0);

  const totalCalculated =
    accommodation + meals + activitiesCost + transport + contingency;

  const difference = targetBudget - totalCalculated;
  const isUnderBudget = difference >= 0;
  const perDayCost = Math.round(totalCalculated / Math.max(1, trip.durationDays));

  const handleSaveBudget = () => {
    const updatedBudget = {
      ...trip.budget,
      targetBudgetUsd: targetBudget,
      accommodationUsd: accommodation,
      mealsDiningUsd: meals,
      activitiesTicketsUsd: activitiesCost,
      localTransportUsd: transport,
      contingencyUsd: contingency,
      totalEstimatedUsd: totalCalculated,
    };
    onUpdateTrip({ ...trip, budget: updatedBudget });
    setIsEditing(false);
  };

  const categories = [
    {
      name: 'Accommodation',
      cost: accommodation,
      icon: <Hotel className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-500',
      percentage: Math.round((accommodation / Math.max(1, totalCalculated)) * 100),
      desc: 'Hotels, ryokans, or boutique apartments',
    },
    {
      name: 'Meals & Dining',
      cost: meals,
      icon: <Utensils className="w-4 h-4 text-orange-600" />,
      color: 'bg-orange-500',
      percentage: Math.round((meals / Math.max(1, totalCalculated)) * 100),
      desc: 'Breakfast, lunch, dinners & street food',
    },
    {
      name: 'Attractions & Sightseeing',
      cost: activitiesCost,
      icon: <Ticket className="w-4 h-4 text-indigo-600" />,
      color: 'bg-indigo-500',
      percentage: Math.round((activitiesCost / Math.max(1, totalCalculated)) * 100),
      desc: 'Temple entry, museum tickets, guided experiences',
    },
    {
      name: 'Local Transport',
      cost: transport,
      icon: <Train className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-500',
      percentage: Math.round((transport / Math.max(1, totalCalculated)) * 100),
      desc: 'Transit cards, metro, buses & regional rail',
    },
    {
      name: 'Contingency Reserve',
      cost: contingency,
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      color: 'bg-rose-500',
      percentage: Math.round((contingency / Math.max(1, totalCalculated)) * 100),
      desc: 'Emergency buffer & unexpected incidentals',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Estimated Cost */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Total Estimated Trip Cost
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-neutral-950 font-mono tabular-nums">
              ${totalCalculated.toLocaleString()} <span className="text-sm font-normal text-neutral-500">USD</span>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Approx. <span className="font-mono tabular-nums font-semibold text-neutral-800">${perDayCost}</span> / day for {trip.durationDays} days
            </div>
          </div>
        </div>

        {/* Target Budget */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Target Budget
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-neutral-950 font-mono tabular-nums">
                ${targetBudget.toLocaleString()} <span className="text-sm font-normal text-neutral-500">USD</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1 capitalize">
                {trip.budgetTier} tier goal
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>
        </div>

        {/* Budget Variance */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Budget Status
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isUnderBudget ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isUnderBudget ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-4">
            <div
              className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                isUnderBudget ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isUnderBudget ? `-$${difference.toLocaleString()}` : `+$${Math.abs(difference).toLocaleString()}`}
            </div>
            <div className="text-xs text-neutral-600 mt-1">
              {isUnderBudget
                ? 'Under target budget (healthy buffer)'
                : 'Exceeds target budget (consider tweaking stays or dining)'}
            </div>
          </div>
        </div>
      </div>

      {/* Proportional distribution bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
          Expense Allocation Breakdown
        </h3>
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-neutral-100">
          {categories.map((c, i) => (
            <div
              key={i}
              className={`${c.color} h-full transition-all`}
              style={{ width: `${c.percentage}%` }}
              title={`${c.name}: ${c.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-neutral-600">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              <span>{c.name}</span>
              <span className="font-mono tabular-nums text-neutral-900 font-semibold">({c.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Category Grid / Editor */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-950">Cost Categories Breakdown</h3>
            <p className="text-xs text-neutral-500">
              Activity costs are automatically computed from your day-by-day plan. You can adjust hotel, meal, and transit estimates below.
            </p>
          </div>
          {isEditing ? (
            <button
              onClick={handleSaveBudget}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Budget</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 border border-neutral-300 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Customize Estimates</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-neutral-100">
          {/* Accommodation */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                <Hotel className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Accommodation & Lodging</h4>
                <p className="text-xs text-neutral-500">
                  Estimated for {trip.durationDays} nights based on {trip.budgetTier} standards.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isEditing ? (
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={25}
                    value={accommodation}
                    onChange={(e) => setAccommodation(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold rounded-lg border border-neutral-300"
                  />
                </div>
              ) : (
                <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
                  ${accommodation.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
                </span>
              )}
            </div>
          </div>

          {/* Meals & Dining */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-700 shrink-0 mt-0.5">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Meals & Dining</h4>
                <p className="text-xs text-neutral-500">
                  Breakfast, lunch, and dinners across all {trip.durationDays} days.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isEditing ? (
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={20}
                    value={meals}
                    onChange={(e) => setMeals(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold rounded-lg border border-neutral-300"
                  />
                </div>
              ) : (
                <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
                  ${meals.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
                </span>
              )}
            </div>
          </div>

          {/* Activities (Live calculated) */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0 mt-0.5">
                <Ticket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Attractions & Sightseeing Tickets</h4>
                <p className="text-xs text-neutral-500">
                  Sum of admission tickets & booked experiences from your day schedule.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
                ${activitiesCost.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
              </span>
            </div>
          </div>

          {/* Local Transit */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                <Train className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Local Transport & Transit Cards</h4>
                <p className="text-xs text-neutral-500">
                  City buses, subways, light rail, and occasional rideshares.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isEditing ? (
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={transport}
                    onChange={(e) => setTransport(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold rounded-lg border border-neutral-300"
                  />
                </div>
              ) : (
                <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
                  ${transport.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
                </span>
              )}
            </div>
          </div>

          {/* Contingency */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-700 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Contingency Reserve</h4>
                <p className="text-xs text-neutral-500">
                  Unforeseen expenses, baggage lockers, souvenir surprises.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              {isEditing ? (
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1.5 text-xs font-bold text-neutral-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={contingency}
                    onChange={(e) => setContingency(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-1 text-xs font-mono font-bold rounded-lg border border-neutral-300"
                  />
                </div>
              ) : (
                <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
                  ${contingency.toLocaleString()} <span className="text-xs font-normal text-neutral-500">USD</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Money Saving Recommendations */}
      {trip.budget.moneySavingTips && trip.budget.moneySavingTips.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>AI Budget Optimization & Saving Secrets</span>
          </div>
          <div className="space-y-2.5">
            {trip.budget.moneySavingTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700">
                <span className="font-mono text-amber-700 font-bold shrink-0">{idx + 1}.</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

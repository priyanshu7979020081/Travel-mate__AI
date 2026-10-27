import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Utensils,
  Share2,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { TripItinerary, DayPlan, Activity } from '../types/trip';
import { ActivityCard } from './ActivityCard';
import { ActivityEditModal } from './ActivityEditModal';
import { AiSwapModal } from './AiSwapModal';

interface ItineraryViewProps {
  trip: TripItinerary;
  onUpdateTrip: (updatedTrip: TripItinerary) => void;
  onPrint: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  onPrint,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isNewActivity, setIsNewActivity] = useState(false);
  const [swapActivity, setSwapActivity] = useState<Activity | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const currentDay: DayPlan | undefined =
    trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];

  // Calculate total activities and completed count
  const allActivities = trip.days.flatMap((d) => d.activities);
  const totalActivitiesCount = allActivities.length;
  const completedActivitiesCount = allActivities.filter((a) => a.completed).length;
  const completionPercentage =
    totalActivitiesCount > 0
      ? Math.round((completedActivitiesCount / totalActivitiesCount) * 100)
      : 0;

  // Toggle activity completion
  const handleToggleComplete = (activityId: string) => {
    const updatedDays = trip.days.map((day) => {
      const updatedActs = day.activities.map((act) => {
        if (act.id === activityId) {
          return { ...act, completed: !act.completed };
        }
        return act;
      });
      return { ...day, activities: updatedActs };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Reorder activities in current day
  const handleMoveUp = (activityId: string) => {
    if (!currentDay) return;
    const index = currentDay.activities.findIndex((a) => a.id === activityId);
    if (index <= 0) return;

    const newActivities = [...currentDay.activities];
    const temp = newActivities[index - 1];
    newActivities[index - 1] = newActivities[index];
    newActivities[index] = temp;

    updateCurrentDayActivities(newActivities);
  };

  const handleMoveDown = (activityId: string) => {
    if (!currentDay) return;
    const index = currentDay.activities.findIndex((a) => a.id === activityId);
    if (index === -1 || index >= currentDay.activities.length - 1) return;

    const newActivities = [...currentDay.activities];
    const temp = newActivities[index + 1];
    newActivities[index + 1] = newActivities[index];
    newActivities[index] = temp;

    updateCurrentDayActivities(newActivities);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!currentDay) return;
    const newActivities = currentDay.activities.filter((a) => a.id !== activityId);
    updateCurrentDayActivities(newActivities);
  };

  const updateCurrentDayActivities = (newActivities: Activity[]) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber === selectedDayNumber) {
        return { ...day, activities: newActivities };
      }
      return day;
    });

    // Recalculate activities cost in budget
    const newTotalActCost = updatedDays
      .flatMap((d) => d.activities)
      .reduce((sum, a) => sum + (Number(a.estimatedCostUsd) || 0), 0);

    const updatedBudget = {
      ...trip.budget,
      activitiesTicketsUsd: newTotalActCost,
      totalEstimatedUsd:
        trip.budget.accommodationUsd +
        trip.budget.mealsDiningUsd +
        newTotalActCost +
        trip.budget.localTransportUsd +
        trip.budget.contingencyUsd,
    };

    onUpdateTrip({ ...trip, days: updatedDays, budget: updatedBudget });
  };

  const handleSaveActivity = (activity: Activity) => {
    if (!currentDay) return;
    let newActivities: Activity[];
    if (isNewActivity) {
      newActivities = [...currentDay.activities, activity];
    } else {
      newActivities = currentDay.activities.map((a) => (a.id === activity.id ? activity : a));
    }
    updateCurrentDayActivities(newActivities);
    setEditingActivity(null);
  };

  const handleApplyAiSwap = (newActivity: Activity) => {
    if (!currentDay) return;
    const newActivities = currentDay.activities.map((a) =>
      a.id === newActivity.id ? newActivity : a
    );
    updateCurrentDayActivities(newActivities);
    setSwapActivity(null);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/\s+/g, '_')}_itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    const summaryText = `${trip.tripTitle}\n${trip.destination} (${trip.startDate} to ${trip.endDate})\n${trip.summary}`;
    navigator.clipboard.writeText(summaryText);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Trip Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-2">
              <span className="font-semibold text-neutral-900">{trip.destination}</span>
              <span aria-hidden="true">·</span>
              <span>{trip.startDate} to {trip.endDate}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{trip.durationDays} Days</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{trip.travelers} Travelers</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{trip.pace} Pace</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize font-semibold text-amber-700">{trip.budgetTier} Budget</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight text-balance">
              {trip.tripTitle}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
              {trip.summary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              title="Copy trip overview"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
              title="Export as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Print formatted itinerary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-neutral-900">Trip Progress:</span>
            <span className="font-mono tabular-nums font-semibold">
              {completedActivitiesCount} of {totalActivitiesCount} activities completed ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full sm:w-48 bg-neutral-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day Selector Navigation Tabs */}
      <div className="bg-white rounded-xl border border-neutral-200 p-2 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {trip.days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const dayDoneCount = day.activities.filter((a) => a.completed).length;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayNumber(day.dayNumber)}
                className={`px-4 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Day {day.dayNumber}
                  </span>
                  {dayDoneCount > 0 && (
                    <span
                      className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {dayDoneCount}/{day.activities.length}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] font-medium truncate max-w-[160px] ${
                    isSelected ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {day.theme}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day View */}
      {currentDay && (
        <div className="space-y-6">
          {/* Day Header Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                <span className="font-bold text-amber-700 font-mono">DAY {currentDay.dayNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{currentDay.date}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-neutral-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {currentDay.areaOrNeighborhood}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-950">
                {currentDay.theme}
              </h3>
            </div>

            <button
              onClick={() => {
                setIsNewActivity(true);
                setEditingActivity(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>Add Custom Activity</span>
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {currentDay.activities.map((activity, idx) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFirst={idx === 0}
                isLast={idx === currentDay.activities.length - 1}
                onToggleComplete={handleToggleComplete}
                onEdit={(act) => {
                  setIsNewActivity(false);
                  setEditingActivity(act);
                }}
                onDelete={handleDeleteActivity}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onAiSwap={(act) => setSwapActivity(act)}
              />
            ))}
          </div>

          {/* Daily Dining Highlights */}
          {currentDay.diningHighlights && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Day {currentDay.dayNumber} Dining & Culinary Recommendations
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Breakfast */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Breakfast
                    </span>
                    <h5 className="font-bold text-sm text-neutral-950 mt-1">
                      {currentDay.diningHighlights.breakfast.name}
                    </h5>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {currentDay.diningHighlights.breakfast.type}
                    </div>
                    <p className="text-xs text-neutral-700 mt-2 font-medium">
                      Must Try: {currentDay.diningHighlights.breakfast.specialty}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                    <span>{currentDay.diningHighlights.breakfast.location || currentDay.areaOrNeighborhood}</span>
                    <span className="font-mono font-semibold text-neutral-900">
                      {currentDay.diningHighlights.breakfast.priceRange}
                    </span>
                  </div>
                </div>

                {/* Lunch */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Lunch
                    </span>
                    <h5 className="font-bold text-sm text-neutral-950 mt-1">
                      {currentDay.diningHighlights.lunch.name}
                    </h5>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {currentDay.diningHighlights.lunch.type}
                    </div>
                    <p className="text-xs text-neutral-700 mt-2 font-medium">
                      Must Try: {currentDay.diningHighlights.lunch.specialty}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                    <span>{currentDay.diningHighlights.lunch.location || currentDay.areaOrNeighborhood}</span>
                    <span className="font-mono font-semibold text-neutral-900">
                      {currentDay.diningHighlights.lunch.priceRange}
                    </span>
                  </div>
                </div>

                {/* Dinner */}
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Dinner
                    </span>
                    <h5 className="font-bold text-sm text-neutral-950 mt-1">
                      {currentDay.diningHighlights.dinner.name}
                    </h5>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {currentDay.diningHighlights.dinner.type}
                    </div>
                    <p className="text-xs text-neutral-700 mt-2 font-medium">
                      Must Try: {currentDay.diningHighlights.dinner.specialty}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                    <span>{currentDay.diningHighlights.dinner.location || currentDay.areaOrNeighborhood}</span>
                    <span className="font-mono font-semibold text-neutral-900">
                      {currentDay.diningHighlights.dinner.priceRange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit / Add Activity Modal */}
      <ActivityEditModal
        isOpen={Boolean(editingActivity) || isNewActivity}
        onClose={() => {
          setEditingActivity(null);
          setIsNewActivity(false);
        }}
        activity={editingActivity}
        isNew={isNewActivity}
        onSave={handleSaveActivity}
      />

      {/* AI Swap Modal */}
      <AiSwapModal
        isOpen={Boolean(swapActivity)}
        onClose={() => setSwapActivity(null)}
        destination={trip.destination}
        dayTheme={currentDay?.theme || ''}
        activity={swapActivity}
        budgetTier={trip.budgetTier}
        onSelectAlternative={handleApplyAiSwap}
      />
    </div>
  );
};

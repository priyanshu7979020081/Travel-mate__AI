import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Lightbulb,
  Sparkles,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  Landmark,
  Utensils,
  Mountain,
  Waves,
  ShoppingBag,
  Car,
  Compass,
} from 'lucide-react';
import { Activity, ActivityCategory } from '../types/trip';

interface ActivityCardProps {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAiSwap: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isFirst,
  isLast,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAiSwap,
}) => {
  const getCategoryIcon = (category: ActivityCategory) => {
    switch (category) {
      case 'dining':
        return <Utensils className="w-3.5 h-3.5 text-orange-600" />;
      case 'culture':
        return <Landmark className="w-3.5 h-3.5 text-indigo-600" />;
      case 'nature':
        return <Mountain className="w-3.5 h-3.5 text-emerald-600" />;
      case 'leisure':
        return <Compass className="w-3.5 h-3.5 text-sky-600" />;
      case 'shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-pink-600" />;
      case 'transport':
        return <Car className="w-3.5 h-3.5 text-neutral-600" />;
      default:
        return <Star className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const getCategoryColor = (category: ActivityCategory) => {
    switch (category) {
      case 'dining':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'culture':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'nature':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'leisure':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'shopping':
        return 'text-pink-700 bg-pink-50 border-pink-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <div
      className={`relative rounded-xl border transition-all ${
        activity.completed
          ? 'bg-neutral-50/80 border-neutral-200 opacity-75'
          : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 text-xs">
            {/* Completion checkbox */}
            <button
              onClick={() => onToggleComplete(activity.id)}
              className="text-neutral-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
              title={activity.completed ? 'Mark uncompleted' : 'Mark completed'}
            >
              {activity.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>

            {/* Time */}
            <span className="font-semibold text-neutral-900 font-mono tabular-nums">
              {activity.time}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-500">{activity.timeSlot}</span>
            <span className="text-neutral-300">·</span>

            {/* Category tag */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${getCategoryColor(
                activity.category
              )}`}
            >
              {getCategoryIcon(activity.category)}
              <span className="capitalize">{activity.category}</span>
            </span>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-1 text-neutral-400">
            {/* Move up / down */}
            <button
              onClick={() => onMoveUp(activity.id)}
              disabled={isFirst}
              className="p-1 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-20 cursor-pointer"
              title="Move up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveDown(activity.id)}
              disabled={isLast}
              className="p-1 hover:text-neutral-700 hover:bg-neutral-100 rounded disabled:opacity-20 cursor-pointer"
              title="Move down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3 bg-neutral-200 mx-0.5" />
            {/* AI Alternative button */}
            <button
              onClick={() => onAiSwap(activity)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer font-medium"
              title="Find alternative with AI"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">Swap with AI</span>
            </button>
            {/* Edit */}
            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              title="Edit activity"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            {/* Delete */}
            <button
              onClick={() => onDelete(activity.id)}
              className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete activity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title and details */}
        <div>
          <h4
            className={`text-base font-bold tracking-tight text-neutral-950 ${
              activity.completed ? 'line-through text-neutral-500' : ''
            }`}
          >
            {activity.title}
          </h4>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-500 mt-1 mb-2.5">
            <span className="flex items-center gap-1 text-neutral-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{activity.locationName}</span>
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{activity.estimatedDuration}</span>
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="font-mono tabular-nums font-semibold text-neutral-800">
              {activity.estimatedCostUsd === 0 ? 'Free' : `$${activity.estimatedCostUsd} USD`}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Insider Tip & Highlight boxes */}
        {(activity.travelTip || activity.recommendedHighlight) && (
          <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {activity.travelTip && (
              <div className="flex items-start gap-1.5 bg-neutral-50 p-2 rounded-lg text-neutral-600">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-800">Insider Tip: </span>
                  <span>{activity.travelTip}</span>
                </div>
              </div>
            )}
            {activity.recommendedHighlight && (
              <div className="flex items-start gap-1.5 bg-neutral-50 p-2 rounded-lg text-neutral-600">
                <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-800">Highlight: </span>
                  <span>{activity.recommendedHighlight}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

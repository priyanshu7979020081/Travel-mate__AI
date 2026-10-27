import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, RefreshCw, Loader2, MapPin, Clock, DollarSign } from 'lucide-react';
import { Activity, ActivityCategory } from '../types/trip';

interface AiSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  dayTheme: string;
  activity: Activity | null;
  budgetTier: string;
  onSelectAlternative: (newActivity: Activity) => void;
}

export const AiSwapModal: React.FC<AiSwapModalProps> = ({
  isOpen,
  onClose,
  destination,
  dayTheme,
  activity,
  budgetTier,
  onSelectAlternative,
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchAlternatives = async () => {
    if (!activity) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/custom-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          dayTheme,
          category: activity.category,
          requestType: 'alternative',
          existingActivityTitle: activity.title,
          budgetTier,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data = await res.json();
      if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error('No suggestions returned');
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to load AI recommendations at this moment. You can edit the activity manually.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activity) {
      fetchAlternatives();
    }
  }, [isOpen, activity]);

  if (!isOpen || !activity) return null;

  const handleApply = (rec: any) => {
    const updated: Activity = {
      ...activity,
      title: rec.title,
      category: (rec.category as ActivityCategory) || activity.category,
      timeSlot: (rec.timeSlot as any) || activity.timeSlot,
      locationName: rec.locationName || activity.locationName,
      description: rec.description || activity.description,
      estimatedDuration: rec.estimatedDuration || activity.estimatedDuration,
      estimatedCostUsd: typeof rec.estimatedCostUsd === 'number' ? rec.estimatedCostUsd : activity.estimatedCostUsd,
      travelTip: rec.travelTip || activity.travelTip,
      recommendedHighlight: rec.recommendedHighlight || activity.recommendedHighlight,
      completed: false,
    };
    onSelectAlternative(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart Swap</span>
            </div>
            <h3 className="text-base font-bold text-neutral-950">
              Alternative Recommendations for "{activity.title}"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <p className="text-xs text-neutral-600">
            Choose a curated alternative to replace this stop in your day plan. Your budget and schedule will update automatically.
          </p>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mb-2" />
              <p className="text-xs font-medium text-neutral-700">Consulting AI for authentic local alternatives...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              {error}
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-amber-400 bg-neutral-50/50 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-neutral-950">{rec.title}</h4>
                      <span className="font-mono tabular-nums text-xs font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200 shrink-0">
                        {rec.estimatedCostUsd === 0 ? 'Free' : `$${rec.estimatedCostUsd} USD`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 mb-2">
                      <span className="flex items-center gap-1 text-neutral-700">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {rec.locationName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {rec.estimatedDuration}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{rec.category}</span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                      {rec.description}
                    </p>

                    {rec.travelTip && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-md mb-3">
                        <span className="font-semibold">Local Tip:</span> {rec.travelTip}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex justify-end">
                    <button
                      onClick={() => handleApply(rec)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Replace with This Spot</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <button
              onClick={fetchAlternatives}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Get Different Suggestions</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

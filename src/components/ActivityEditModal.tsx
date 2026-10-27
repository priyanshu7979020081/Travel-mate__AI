import React, { useState, useEffect } from 'react';
import { X, Save, Clock, MapPin, DollarSign } from 'lucide-react';
import { Activity, ActivityCategory } from '../types/trip';

interface ActivityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (updatedActivity: Activity) => void;
  isNew?: boolean;
}

export const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  onClose,
  activity,
  onSave,
  isNew = false,
}) => {
  const [formData, setFormData] = useState<Activity>({
    id: `act-custom-${Date.now()}`,
    timeSlot: 'Morning',
    time: '10:00 AM',
    title: '',
    category: 'attraction',
    description: '',
    locationName: '',
    estimatedDuration: '1.5 hours',
    estimatedCostUsd: 15,
    travelTip: '',
    recommendedHighlight: '',
    completed: false,
    notes: '',
  });

  useEffect(() => {
    if (activity) {
      setFormData(activity);
    } else {
      setFormData({
        id: `act-custom-${Date.now()}`,
        timeSlot: 'Morning',
        time: '10:00 AM',
        title: '',
        category: 'attraction',
        description: '',
        locationName: '',
        estimatedDuration: '1.5 hours',
        estimatedCostUsd: 15,
        travelTip: '',
        recommendedHighlight: '',
        completed: false,
        notes: '',
      });
    }
  }, [activity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <h3 className="text-base font-bold text-neutral-950">
            {isNew ? 'Add Custom Activity' : 'Edit Itinerary Activity'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Activity Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Traditional Tea Ceremony at Historic Machiya"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-hidden focus:border-amber-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Time Slot
              </label>
              <select
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 bg-white"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Specific Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="09:30 AM"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 bg-white"
              >
                <option value="attraction">Attraction</option>
                <option value="culture">Culture & History</option>
                <option value="dining">Dining & Food</option>
                <option value="nature">Nature & Outdoors</option>
                <option value="leisure">Leisure & Stroll</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Estimated Cost ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-neutral-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={formData.estimatedCostUsd}
                  onChange={(e) => setFormData({ ...formData, estimatedCostUsd: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Gion Historic District"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                placeholder="e.g. 2 hours"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What makes this activity special and worth visiting..."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Insider Travel Tip
              </label>
              <input
                type="text"
                value={formData.travelTip}
                onChange={(e) => setFormData({ ...formData, travelTip: e.target.value })}
                placeholder="e.g. Arrive before 9 AM for photos without crowds."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Highlight / Photo Spot
              </label>
              <input
                type="text"
                value={formData.recommendedHighlight}
                onChange={(e) => setFormData({ ...formData, recommendedHighlight: e.target.value })}
                placeholder="e.g. Sunset view from upper terrace."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Personal Notes
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Reservation confirmation #10492"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
            />
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isNew ? 'Add to Day' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

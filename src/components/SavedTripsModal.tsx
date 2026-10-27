import React, { useRef } from 'react';
import {
  X,
  Compass,
  Calendar,
  DollarSign,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Upload,
} from 'lucide-react';
import { TripItinerary } from '../types/trip';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: TripItinerary[];
  activeTripId: string;
  onSelectTrip: (trip: TripItinerary) => void;
  onDeleteTrip: (tripId: string) => void;
  onDuplicateTrip: (trip: TripItinerary) => void;
  onImportTrip: (trip: TripItinerary) => void;
  onNewTrip: () => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  activeTripId,
  onSelectTrip,
  onDeleteTrip,
  onDuplicateTrip,
  onImportTrip,
  onNewTrip,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tripTitle && json.days && json.destination) {
          const importedTrip: TripItinerary = {
            ...json,
            id: `trip-imported-${Date.now()}`,
            updatedAt: new Date().toISOString(),
          };
          onImportTrip(importedTrip);
        } else {
          alert('Invalid trip format. File does not contain expected itinerary data.');
        }
      } catch (err) {
        console.error('Failed to parse trip JSON', err);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-neutral-950">
              Saved Trips Vault ({savedTrips.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved trips */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Switch between saved itineraries, duplicate them, or import backups.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNewTrip();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Trip</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {savedTrips.map((trip) => {
              const isActive = trip.id === activeTripId;
              const totalActs = trip.days.flatMap((d) => d.activities).length;
              const doneActs = trip.days
                .flatMap((d) => d.activities)
                .filter((a) => a.completed).length;

              return (
                <div
                  key={trip.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                      <span className="font-semibold text-neutral-900">{trip.destination}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        {trip.durationDays} Days
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize font-mono tabular-nums">
                        ${trip.budget?.totalEstimatedUsd?.toLocaleString() || '—'} USD
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-neutral-950">
                      {trip.tripTitle}
                    </h4>

                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                      <span>{trip.startDate} to {trip.endDate}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {doneActs}/{totalActs} activities completed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isActive ? (
                      <span className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 rounded-lg">
                        Active Trip
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectTrip(trip);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Load Itinerary</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDuplicateTrip(trip)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Duplicate this trip"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {savedTrips.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete trip "${trip.tripTitle}"?`)) {
                            onDeleteTrip(trip.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

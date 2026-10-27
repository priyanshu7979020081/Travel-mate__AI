import React from 'react';
import { X, Printer, Compass, MapPin, Calendar, DollarSign } from 'lucide-react';
import { TripItinerary } from '../types/trip';

interface PrintableItineraryProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripItinerary;
}

export const PrintableItinerary: React.FC<PrintableItineraryProps> = ({
  isOpen,
  onClose,
  trip,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden my-6">
        {/* Print controls bar (hidden during print) */}
        <div className="print:hidden px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-neutral-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              Printable Itinerary / PDF Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print or Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-8 sm:p-12 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 text-neutral-900 font-sans">
          {/* Header */}
          <div className="border-b-2 border-neutral-900 pb-6 mb-8">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="font-bold tracking-widest uppercase text-amber-700">
                TRAVELMATE AI · OFFICIAL TRIP ITINERARY
              </span>
              <span>Generated {new Date(trip.updatedAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950">
              {trip.tripTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 mt-2 font-medium">
              <span>{trip.destination}</span>
              <span>·</span>
              <span>{trip.startDate} to {trip.endDate} ({trip.durationDays} Days)</span>
              <span>·</span>
              <span className="capitalize">{trip.travelers}</span>
              <span>·</span>
              <span className="capitalize">{trip.pace} Pace</span>
              <span>·</span>
              <span className="font-mono tabular-nums font-bold text-neutral-900">
                Est. ${trip.budget.totalEstimatedUsd.toLocaleString()} USD
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed italic">
              "{trip.summary}"
            </p>
          </div>

          {/* Day by Day Plan */}
          <div className="space-y-8">
            {trip.days.map((day) => (
              <div key={day.dayNumber} className="break-inside-avoid">
                <div className="bg-neutral-100 p-3 rounded-lg flex items-center justify-between mb-3 border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-neutral-900 font-mono">
                      DAY {day.dayNumber}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-xs font-bold text-neutral-800">{day.theme}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{day.date} · {day.areaOrNeighborhood}</span>
                </div>

                {/* Activities Table */}
                <div className="space-y-3 pl-2">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="border-l-2 border-neutral-300 pl-4 py-1 flex flex-col justify-between"
                    >
                      <div className="flex items-baseline justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{act.time}</span>
                          <span className="font-bold text-sm text-neutral-950">{act.title}</span>
                          <span className="capitalize text-[11px] text-neutral-500">({act.category})</span>
                        </div>
                        <span className="font-mono tabular-nums font-semibold text-neutral-700">
                          {act.estimatedCostUsd === 0 ? 'Free' : `$${act.estimatedCostUsd}`}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                        <span>{act.locationName}</span>
                        <span>·</span>
                        <span>{act.estimatedDuration}</span>
                      </div>

                      <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                        {act.description}
                      </p>

                      {act.travelTip && (
                        <p className="text-[11px] text-neutral-600 mt-1 bg-neutral-50 p-1.5 rounded">
                          <span className="font-semibold text-neutral-800">Tip:</span> {act.travelTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dining */}
                {day.diningHighlights && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-neutral-500 block mb-1">
                      Recommended Dining
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <span className="font-bold text-neutral-900">Breakfast: </span>
                        <span>{day.diningHighlights.breakfast.name} ({day.diningHighlights.breakfast.priceRange})</span>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900">Lunch: </span>
                        <span>{day.diningHighlights.lunch.name} ({day.diningHighlights.lunch.priceRange})</span>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-900">Dinner: </span>
                        <span>{day.diningHighlights.dinner.name} ({day.diningHighlights.dinner.priceRange})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Budget & Tips footer */}
          <div className="mt-10 pt-6 border-t-2 border-neutral-900 grid grid-cols-1 sm:grid-cols-2 gap-6 break-inside-avoid text-xs">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Estimated Budget Summary
              </h3>
              <ul className="space-y-1 font-mono text-neutral-700">
                <li className="flex justify-between">
                  <span>Accommodation:</span>
                  <span>${trip.budget.accommodationUsd}</span>
                </li>
                <li className="flex justify-between">
                  <span>Meals & Dining:</span>
                  <span>${trip.budget.mealsDiningUsd}</span>
                </li>
                <li className="flex justify-between">
                  <span>Sightseeing & Activities:</span>
                  <span>${trip.budget.activitiesTicketsUsd}</span>
                </li>
                <li className="flex justify-between">
                  <span>Local Transit:</span>
                  <span>${trip.budget.localTransportUsd}</span>
                </li>
                <li className="flex justify-between font-bold text-neutral-950 pt-1 border-t border-neutral-200">
                  <span>Total Estimated:</span>
                  <span>${trip.budget.totalEstimatedUsd} USD</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Important Travel Tips
              </h3>
              <p className="text-neutral-600 mb-1.5">
                <span className="font-semibold text-neutral-900">Transit:</span> {trip.tips.localTransport}
              </p>
              <p className="text-neutral-600">
                <span className="font-semibold text-neutral-900">Etiquette:</span> {trip.tips.etiquetteAndCulture}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

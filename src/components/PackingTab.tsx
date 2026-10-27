import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Luggage,
  Sparkles,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { TripItinerary, PackingCategory } from '../types/trip';

interface PackingTabProps {
  trip: TripItinerary;
  onUpdateTrip: (updatedTrip: TripItinerary) => void;
}

export const PackingTab: React.FC<PackingTabProps> = ({ trip, onUpdateTrip }) => {
  const [newItemName, setNewItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    trip.packingList[0]?.category || 'Clothing & Footwear'
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Calculate packed counts
  const allItems = trip.packingList.flatMap((c) => c.items);
  const totalCount = allItems.length;
  const packedCount = allItems.filter((i) => i.packed).length;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggleItem = (categoryId: string, itemId: string) => {
    const updated = trip.packingList.map((cat) => {
      if (cat.category === categoryId) {
        return {
          ...cat,
          items: cat.items.map((it) => (it.id === itemId ? { ...it, packed: !it.packed } : it)),
        };
      }
      return cat;
    });
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      packed: false,
    };

    const updated = trip.packingList.map((cat) => {
      if (cat.category === selectedCategory) {
        return { ...cat, items: [...cat.items, newItem] };
      }
      return cat;
    });

    onUpdateTrip({ ...trip, packingList: updated });
    setNewItemName('');
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updated = trip.packingList.map((cat) => {
      if (cat.category === categoryId) {
        return { ...cat, items: cat.items.filter((it) => it.id !== itemId) };
      }
      return cat;
    });
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: PackingCategory = {
      category: newCategoryName.trim(),
      items: [],
    };

    onUpdateTrip({ ...trip, packingList: [...trip.packingList, newCat] });
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleMarkAllPacked = () => {
    const updated = trip.packingList.map((cat) => ({
      ...cat,
      items: cat.items.map((it) => ({ ...it, packed: true })),
    }));
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleResetChecklist = () => {
    const updated = trip.packingList.map((cat) => ({
      ...cat,
      items: cat.items.map((it) => ({ ...it, packed: false })),
    }));
    onUpdateTrip({ ...trip, packingList: updated });
  };

  return (
    <div className="space-y-6">
      {/* Overview & Progress Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Luggage className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-950">
                Tailored Packing Checklist for {trip.destination}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Seasonal note: {trip.seasonSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPacked}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Pack All
            </button>
            <button
              onClick={handleResetChecklist}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Reset checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs font-medium text-neutral-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>
              <span className="font-mono tabular-nums font-bold text-neutral-900">{packedCount}</span> of{' '}
              <span className="font-mono tabular-nums font-bold text-neutral-900">{totalCount}</span> items packed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full sm:w-64 bg-neutral-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Item Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add an essential item to pack..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-hidden focus:border-amber-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 bg-white focus:outline-hidden focus:border-amber-600"
            >
              {trip.packingList.map((cat, i) => (
                <option key={i} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* Packing Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trip.packingList.map((category, catIdx) => {
          const catPacked = category.items.filter((i) => i.packed).length;
          const catTotal = category.items.length;
          return (
            <div
              key={catIdx}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                  <h3 className="font-bold text-sm text-neutral-900">{category.category}</h3>
                  <span className="text-xs font-mono tabular-nums text-neutral-500">
                    {catPacked}/{catTotal}
                  </span>
                </div>

                {category.items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-neutral-400">
                    No items in this category yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${
                          item.packed
                            ? 'bg-neutral-50 text-neutral-400 line-through'
                            : 'hover:bg-neutral-50 text-neutral-800'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleItem(category.category, item.id)}
                          className="flex items-center gap-2.5 text-left text-xs sm:text-sm font-medium cursor-pointer flex-1"
                        >
                          {item.packed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-400 shrink-0" />
                          )}
                          <span>{item.name}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteItem(category.category, item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 transition-opacity cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

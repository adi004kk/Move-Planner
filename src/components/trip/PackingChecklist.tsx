import React, { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Search,
  Briefcase,
  Sparkles,
  RotateCcw,
  Copy,
  Printer,
  CheckCircle,
  Circle,
  Info,
  X,
  Layers,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { Trip, PackingItem, PackingCategory } from '../../types/travel';
import { PACKING_CATEGORIES, generateDefaultPackingList } from '../../data/packingDefaults';
import { useTravel } from '../../context/TravelContext';

interface PackingChecklistProps {
  trip: Trip;
  destinationCategory?: string;
}

export const PackingChecklist: React.FC<PackingChecklistProps> = ({ trip, destinationCategory = 'Hill Station' }) => {
  const { updateTrip, showToast } = useTravel();

  // If trip doesn't have a packingChecklist yet, initialize from defaults
  const checklist: PackingItem[] = useMemo(() => {
    if (trip.packingChecklist && trip.packingChecklist.length > 0) {
      return trip.packingChecklist;
    }
    return generateDefaultPackingList({
      destinationName: trip.destinationName,
      category: destinationCategory,
      durationDays: trip.itinerary?.days?.length || 4,
      travellersCount: trip.travellers?.adults || 2
    });
  }, [trip.packingChecklist, trip.destinationName, destinationCategory, trip.itinerary?.days?.length, trip.travellers?.adults]);

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unpacked' | 'Packed'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New Item Form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingCategory>('Miscellaneous');
  const [newItemQuantity, setNewItemQuantity] = useState<number>(1);
  const [newItemNotes, setNewItemNotes] = useState('');

  // Persist helper
  const saveChecklist = (updatedList: PackingItem[], toastMsg?: string | null) => {
    updateTrip(
      {
        ...trip,
        packingChecklist: updatedList
      },
      toastMsg !== undefined ? toastMsg : null
    );
  };

  // Toggle packed state
  const toggleItemPacked = (itemId: string) => {
    const updated = checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, packed: !item.packed };
      }
      return item;
    });
    saveChecklist(updated, null);
  };

  // Delete item
  const handleDeleteItem = (itemId: string, itemName: string) => {
    const updated = checklist.filter(item => item.id !== itemId);
    saveChecklist(updated, null);
    showToast(`Removed "${itemName}"`);
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      packed: false,
      isCustom: true,
      quantity: newItemQuantity > 1 ? newItemQuantity : undefined,
      notes: newItemNotes.trim() ? newItemNotes.trim() : undefined
    };

    const updated = [newItem, ...checklist];
    saveChecklist(updated, `Added "${newItem.name}" to packing list`);

    // Reset form
    setNewItemName('');
    setNewItemNotes('');
    setNewItemQuantity(1);
    setShowAddForm(false);
  };

  // Pack All / Unpack All
  const handleToggleAll = (targetState: boolean) => {
    const updated = checklist.map(item => ({ ...item, packed: targetState }));
    saveChecklist(updated, targetState ? 'All items marked as packed!' : 'Checklist reset to unpacked.');
  };

  // Reset to default recommendations
  const handleResetToDefaults = () => {
    if (confirm('Reset checklist to recommended essentials for this trip? Custom items will be removed.')) {
      const defaults = generateDefaultPackingList({
        destinationName: trip.destinationName,
        category: destinationCategory,
        durationDays: trip.itinerary?.days?.length || 4,
        travellersCount: trip.travellers?.adults || 2
      });
      saveChecklist(defaults, 'Checklist reset to destination recommendations.');
    }
  };

  // Copy checklist to clipboard
  const handleCopyChecklist = () => {
    if (!navigator.clipboard) return;
    const lines = [
      `MovePlanner Packing Checklist for ${trip.title} (${trip.destinationName})`,
      `Dates: ${trip.startDate} to ${trip.endDate}`,
      '----------------------------------------',
      ...checklist.map(item => `[${item.packed ? 'x' : ' '}] ${item.name}${item.quantity ? ` (Qty: ${item.quantity})` : ''} - ${item.category}${item.notes ? ` (${item.notes})` : ''}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    showToast('Checklist copied to clipboard!');
  };

  // Counts & metrics
  const totalCount = checklist.length;
  const packedCount = checklist.filter(i => i.packed).length;
  const unpackedCount = totalCount - packedCount;
  const progressPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Filtered items
  const filteredItems = useMemo(() => {
    return checklist.filter(item => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'Unpacked' && item.packed) return false;
      if (statusFilter === 'Packed' && !item.packed) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        return matchesName || matchesCategory || matchesNotes;
      }
      return true;
    });
  }, [checklist, activeCategory, statusFilter, searchQuery]);

  // Group by category when viewing 'All' and no search
  const categoriesPresent = useMemo(() => {
    const set = new Set(checklist.map(i => i.category));
    return PACKING_CATEGORIES.filter(c => set.has(c));
  }, [checklist]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Packing Checklist
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Tailored essentials for <strong>{trip.destinationName}</strong> &bull; {trip.travellers.adults} travellers, {trip.itinerary?.days?.length || 4} days
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? 'Cancel' : 'Add Item'}</span>
          </button>

          <button
            onClick={handleCopyChecklist}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Copy checklist text"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 no-print transition-colors"
            title="Print checklist"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetToDefaults}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Reset to recommended essentials"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Progress Bar Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-sky-300 uppercase tracking-wider text-[11px] font-bold">Luggage Progress</span>
            {progressPercent === 100 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-400/30">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>100% Ready to Fly!</span>
              </span>
            )}
          </div>
          <span className="text-white font-bold">
            {packedCount} / {totalCount} packed ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              progressPercent === 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                : progressPercent > 50
                ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                : 'bg-gradient-to-r from-sky-500 to-sky-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
          <span>{unpackedCount} item{unpackedCount === 1 ? '' : 's'} remaining</span>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleAll(true)}
              className="text-sky-300 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Pack All
            </button>
            <span className="text-slate-500">&bull;</span>
            <button
              onClick={() => handleToggleAll(false)}
              className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Unpack All
            </button>
          </div>
        </div>
      </div>

      {/* Quick-Toggle Key Essentials (Passport, Tickets, Medication, Power Bank, ID) */}
      <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Essential Must-Packs (Quick Toggle)</span>
          </span>
          <span className="text-[11px] text-slate-400">Click to check off high-priority essentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'doc-gov-id',
              label: 'Passport / Government ID',
              matchKey: 'passport',
              category: 'Documents & IDs' as PackingCategory
            },
            {
              id: 'doc-tickets',
              label: 'Flight & Transit Tickets',
              matchKey: 'ticket',
              category: 'Documents & IDs' as PackingCategory
            },
            {
              id: 'health-prescriptions',
              label: 'Daily Prescriptions & Medication',
              matchKey: 'medication',
              category: 'Health & Medication' as PackingCategory
            }
          ].map(shortcut => {
            const matchedItem = checklist.find(
              i => i.id === shortcut.id || i.name.toLowerCase().includes(shortcut.matchKey)
            );
            const isPacked = matchedItem ? matchedItem.packed : false;

            return (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => {
                  if (matchedItem) {
                    toggleItemPacked(matchedItem.id);
                  } else {
                    // If not present in checklist, add it and toggle packed
                    const newItem: PackingItem = {
                      id: shortcut.id,
                      name: shortcut.label,
                      category: shortcut.category,
                      packed: true,
                      isCustom: true
                    };
                    saveChecklist([newItem, ...checklist], `Added and checked off ${shortcut.label}`);
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none text-left ${
                  isPacked
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all ${
                      isPacked
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isPacked && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className={`truncate ${isPacked ? 'line-through text-emerald-800/80 font-normal' : ''}`}>
                    {shortcut.label}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isPacked ? 'bg-emerald-200/70 text-emerald-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isPacked ? 'Packed' : 'Pack'}
                </span>
              </button>
            );
          })}
        </div>
      </div>


      {/* Add Custom Item Expandable Panel */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomItem}
          className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-4 transition-all animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Packing Item</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GoPro Hero 12, Noise earplugs, Yoga mat..."
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Category
              </label>
              <select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value as PackingCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-sky-500"
              >
                {PACKING_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={newItemQuantity}
                onChange={e => setNewItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Notes or Reminders (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Keep in carry-on backpack, bring spare batteries..."
              value={newItemNotes}
              onChange={e => setNewItemNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
            >
              Add to Checklist
            </button>
          </div>
        </form>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, categories, or notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl">
          {(['All', 'Unpacked', 'Packed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} {st === 'Unpacked' ? `(${unpackedCount})` : st === 'Packed' ? `(${packedCount})` : `(${totalCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'All'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Categories ({totalCount})
        </button>

        {categoriesPresent.map(cat => {
          const catCount = checklist.filter(i => i.category === cat).length;
          const catPacked = checklist.filter(i => i.category === cat && i.packed).length;
          const isComplete = catCount > 0 && catCount === catPacked;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                activeCategory === cat ? 'bg-slate-800 text-sky-300' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {catPacked}/{catCount}
              </span>
              {isComplete && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No items match your criteria</p>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {statusFilter === 'Unpacked' && unpackedCount === 0
                ? 'Great job! Everything is packed and ready for your trip.'
                : 'Try clearing the search query or category filters.'}
            </p>
            {(searchQuery || statusFilter !== 'All' || activeCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setActiveCategory('All');
                }}
                className="mt-2 px-3 py-1 text-xs font-bold text-sky-600 hover:text-sky-700 underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredItems.map(item => {
            return (
              <div
                key={item.id}
                className={`group flex items-start sm:items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.packed
                    ? 'bg-slate-50/70 border-slate-200/80'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Left check & title */}
                <div
                  onClick={() => toggleItemPacked(item.id)}
                  className="flex items-start sm:items-center gap-3.5 flex-1 cursor-pointer select-none"
                >
                  <button
                    type="button"
                    className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                      item.packed
                        ? 'bg-emerald-600 text-white shadow-xs scale-105'
                        : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-0.5 flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold leading-relaxed transition-all ${
                          item.packed
                            ? 'line-through text-slate-400 font-normal'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </span>

                      {item.quantity && item.quantity > 1 && (
                        <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                          x{item.quantity}
                        </span>
                      )}

                      {item.isCustom && (
                        <span className="px-1.5 py-0.2 rounded-md bg-purple-50 text-[10px] font-bold text-purple-700 border border-purple-200/60">
                          Custom
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                      <span className="text-slate-500 font-medium">{item.category}</span>
                      {item.notes && (
                        <>
                          <span>&bull;</span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <Info className="w-2.5 h-2.5 text-amber-600" />
                            {item.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5 sm:pt-0">
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-80 sm:opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Helpful Packing Tip Banner */}
      <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-start gap-3 text-xs text-sky-950">
        <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Smart MovePlanner Packing Advice</p>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Always store your passport, ID cards, prescribed medicines, and power bank in your carry-on luggage. Never pack battery packs or essential identity documents in check-in bags.
          </p>
        </div>
      </div>

    </div>
  );
};

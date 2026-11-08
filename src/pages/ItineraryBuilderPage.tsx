import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Printer,
  Share2,
  CheckCircle,
  Circle,
  Sparkles,
  DollarSign,
  Car,
  Footprints,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SAMPLE_ITINERARIES, DESTINATIONS } from '../data/travelData';
import { Itinerary, ItineraryDay, ItineraryStop } from '../types/travel';
import { ItineraryWeatherWidget } from '../components/itinerary/ItineraryWeatherWidget';

export const ItineraryBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trips, updateTrip, formatPrice, showToast } = useTravel();

  // Find itinerary from trips or sample itineraries
  const matchingTrip = trips.find(t => t.itinerary.id === id || t.id === id);
  const initialItinerary = matchingTrip?.itinerary || SAMPLE_ITINERARIES.find(i => i.id === id) || SAMPLE_ITINERARIES[0];

  const [itinerary, setItinerary] = useState<Itinerary>(initialItinerary);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Stop form state
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newCategory, setNewCategory] = useState<'Attraction' | 'Food' | 'Activity' | 'Transport' | 'Custom'>('Attraction');
  const [newTime, setNewTime] = useState('02:00 PM');
  const [newDuration, setNewDuration] = useState(90);
  const [newCost, setNewCost] = useState(200);
  const [newNotes, setNewNotes] = useState('');

  // Keep synced with trip if present
  useEffect(() => {
    if (matchingTrip) {
      updateTrip({ ...matchingTrip, itinerary });
    }
  }, [itinerary]);

  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  const destObj = DESTINATIONS.find(
    d => d.id === itinerary.destinationId ||
         d.name.toLowerCase() === itinerary.destinationName?.toLowerCase() ||
         (itinerary.destinationName && d.name.toLowerCase().includes(itinerary.destinationName.toLowerCase())) ||
         d.slug === itinerary.destinationId
  ) || DESTINATIONS[0];

  // Stop Reordering: Move up
  const moveStopUp = (stopIndex: number) => {
    if (stopIndex === 0) return;
    setItinerary(prev => {
      const updatedDays = [...prev.days];
      const stops = [...updatedDays[activeDayIndex].stops];
      const temp = stops[stopIndex - 1];
      stops[stopIndex - 1] = stops[stopIndex];
      stops[stopIndex] = temp;
      updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], stops };
      return { ...prev, days: updatedDays };
    });
    showToast('Activity order updated');
  };

  // Stop Reordering: Move down
  const moveStopDown = (stopIndex: number) => {
    if (stopIndex === activeDay.stops.length - 1) return;
    setItinerary(prev => {
      const updatedDays = [...prev.days];
      const stops = [...updatedDays[activeDayIndex].stops];
      const temp = stops[stopIndex + 1];
      stops[stopIndex + 1] = stops[stopIndex];
      stops[stopIndex] = temp;
      updatedDays[activeDayIndex] = { ...updatedDays[activeDayIndex], stops };
      return { ...prev, days: updatedDays };
    });
    showToast('Activity order updated');
  };

  // Delete stop
  const deleteStop = (stopId: string) => {
    setItinerary(prev => {
      const updatedDays = prev.days.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
          ...day,
          stops: day.stops.filter(s => s.id !== stopId)
        };
      });
      return { ...prev, days: updatedDays };
    });
    showToast('Stop removed from itinerary', 'info');
  };

  // Toggle completed
  const toggleStopCompleted = (stopId: string) => {
    setItinerary(prev => {
      const updatedDays = prev.days.map((day, idx) => {
        if (idx !== activeDayIndex) return day;
        return {
          ...day,
          stops: day.stops.map(s => s.id === stopId ? { ...s, completed: !s.completed } : s)
        };
      });
      return { ...prev, days: updatedDays };
    });
    showToast('Progress updated!');
  };

  // Add custom stop
  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;

    const createdStop: ItineraryStop = {
      id: `custom-stop-${Date.now()}`,
      placeName: newPlaceName.trim(),
      category: newCategory,
      timeSlot: 'Afternoon',
      suggestedTime: newTime,
      durationMinutes: newDuration,
      location: itinerary.destinationName,
      estimatedCost: newCost,
      transportMode: 'Walk',
      transportCost: 0,
      notes: newNotes.trim() || undefined,
      completed: false
    };

    setItinerary(prev => {
      const updatedDays = [...prev.days];
      updatedDays[activeDayIndex] = {
        ...updatedDays[activeDayIndex],
        stops: [...updatedDays[activeDayIndex].stops, createdStop]
      };
      return { ...prev, days: updatedDays };
    });

    setNewPlaceName('');
    setNewNotes('');
    setShowAddModal(false);
    showToast(`Added "${createdStop.placeName}" to Day ${activeDay.dayNumber}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Day calculations
  const dayCost = activeDay.stops.reduce((sum, s) => sum + s.estimatedCost + (s.transportCost || 0), 0);
  const totalCompletedStops = itinerary.days.reduce(
    (sum, d) => sum + d.stops.filter(s => s.completed).length,
    0
  );
  const totalStopsCount = itinerary.days.reduce((sum, d) => sum + d.stops.length, 0);

  return (
    <div className="space-y-8 pb-20 print-page">
      
      {/* Header Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                {itinerary.durationDays} Days &bull; {itinerary.travelStyle} Pace
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {totalCompletedStops} of {totalStopsCount} stops completed
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {itinerary.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors print-include"
              title="Print or Export PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Itinerary share link copied!');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Days Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 no-print scrollbar-none">
          {itinerary.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeDayIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              Day {day.dayNumber}: {day.theme}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Forecast & Outdoor Activity Advisory */}
      <div className="no-print">
        <ItineraryWeatherWidget
          coordinates={destObj.coordinates}
          destinationName={itinerary.destinationName || destObj.name}
          category={destObj.category}
          startDate={matchingTrip?.startDate}
          daysCount={itinerary.days.length}
          activeDayNumber={activeDay.dayNumber}
          onSelectDay={(dayNum) => {
            const targetIdx = itinerary.days.findIndex(d => d.dayNumber === dayNum);
            if (targetIdx !== -1) {
              setActiveDayIndex(targetIdx);
            }
          }}
        />
      </div>

      {/* Active Day Schedule Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
            Day {activeDay.dayNumber} Schedule
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
            {activeDay.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Theme: <strong>{activeDay.theme}</strong> &bull; {activeDay.stops.length} planned stops
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Day Cost</span>
            <span className="text-xl font-extrabold text-white">{formatPrice(dayCost)}</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md no-print transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Timeline Stops */}
      <div className="space-y-4">
        {activeDay.stops.map((stop, index) => {
          return (
            <div
              key={stop.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                stop.completed ? 'bg-slate-50/70 border-slate-200 opacity-80' : 'border-slate-200/80 hover:shadow-md'
              }`}
            >
              {/* Left Column: Number, Checkbox & Info */}
              <div className="flex items-start gap-4">
                
                {/* Completion Toggle */}
                <button
                  onClick={() => toggleStopCompleted(stop.id)}
                  className="mt-1 text-slate-400 hover:text-emerald-600 no-print transition-colors"
                  title={stop.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {stop.completed ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">
                      {stop.suggestedTime}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {stop.category}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stop.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className={`font-serif text-lg font-bold text-slate-900 ${stop.completed ? 'line-through text-slate-500' : ''}`}>
                    {stop.placeName}
                  </h3>

                  {stop.notes && (
                    <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                      {stop.notes}
                    </p>
                  )}

                  {/* Transport to next stop info */}
                  {stop.distanceToNextKm && (
                    <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-sky-600" />
                      <span>{stop.distanceToNextKm} km to next stop via {stop.transportMode || 'Taxi'} (~{formatPrice(stop.transportCost || 0)})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Pricing & Reorder Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-bold text-slate-900 block">
                    {stop.estimatedCost === 0 ? 'Free' : formatPrice(stop.estimatedCost)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">estimated cost</span>
                </div>

                <div className="flex items-center gap-1 no-print">
                  <button
                    onClick={() => moveStopUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveStopDown(index)}
                    disabled={index === activeDay.stops.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteStop(stop.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove stop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Custom Stop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif font-bold text-slate-900 text-xl">
              Add Activity to Day {activeDay.dayNumber}
            </h3>

            <form onSubmit={handleAddStop} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Place or Activity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset drinks at cliffside cafe"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 font-semibold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700"
                  >
                    <option value="Attraction">Attraction</option>
                    <option value="Food">Food / Dining</option>
                    <option value="Activity">Adventure Activity</option>
                    <option value="Custom">Custom Stop</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 03:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Cost (INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Tips</label>
                <textarea
                  placeholder="Notes about booking, tickets, or directions..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 h-20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

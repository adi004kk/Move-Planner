import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Trash2,
  Copy,
  Edit,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { DESTINATIONS } from '../data/travelData';
import { PackingChecklist } from '../components/trip/PackingChecklist';
import { TripWeatherWidget } from '../components/trip/TripWeatherWidget';

export const TripDetailPage: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, deleteTrip, duplicateTrip, formatPrice, showToast } = useTravel();

  const trip = trips.find(t => t.id === id) || trips[0];

  const destObj = DESTINATIONS.find(
    d => d.id === trip?.destinationId ||
         d.name.toLowerCase() === trip?.destinationName?.toLowerCase() ||
         d.slug === trip?.destinationId
  );
  const destinationCategory = destObj?.category || 'Hill Station';

  const totalPackingItems = trip?.packingChecklist?.length || 0;
  const packedItems = trip?.packingChecklist?.filter(i => i.packed).length || 0;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState(trip?.notes || '');

  if (!trip) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 text-sm">Trip not found.</p>
        <Link to="/trips" className="text-sky-600 font-bold text-xs mt-2 inline-block">Return to My Trips</Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: 'Planning' | 'Confirmed' | 'Completed') => {
    updateTrip({ ...trip, status: newStatus });
    showToast(`Trip marked as ${newStatus}`);
  };

  const handleSaveNotes = () => {
    updateTrip({ ...trip, notes: notesInput });
    setIsEditingNotes(false);
    showToast('Trip notes saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link to="/trips" className="hover:text-sky-600 font-medium">&larr; Back to Trips</Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => duplicateTrip(trip.id)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${trip.title}"?`)) {
                  deleteTrip(trip.id);
                  navigate('/trips');
                }
              }}
              className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                {trip.destinationName}
              </span>
              <div className="flex items-center gap-1 text-xs">
                {(['Planning', 'Confirmed', 'Completed'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                      trip.status === st
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
              {trip.title}
            </h1>
          </div>

          <Link
            to={`/itinerary/${trip.itinerary?.id || trip.id}`}
            className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-sky-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Itinerary Builder</span>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden h-64 sm:h-80 w-full bg-slate-100 shadow-inner">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dates</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">{trip.startDate} to {trip.endDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Party Size</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">
              {trip.travellers.adults} Adults ({trip.travellers.type})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Budget</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">{formatPrice(trip.totalBudget)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travel Pace</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">{trip.travelStyle}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Packing</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-sky-600" />
              <span>{totalPackingItems > 0 ? `${packedItems}/${totalPackingItems} Packed` : 'Checklist Ready'}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Itinerary Schedule Sneak-Peek */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Day-by-Day Schedule ({trip.itinerary?.days?.length || 1} Days)
          </h2>
          <Link
            to={`/itinerary/${trip.itinerary?.id || trip.id}`}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Edit Full Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {trip.itinerary?.days?.map((day) => (
            <div key={day.dayNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Day {day.dayNumber}: {day.title}</span>
                <span className="text-slate-400">{day.stops.length} planned stops</span>
              </div>
              <p className="text-xs text-slate-500">
                Stops: {day.stops.map(s => s.placeName).join(' &bull; ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Weather Widget for Destination & Travel Dates */}
      <TripWeatherWidget
        coordinates={destObj?.coordinates || { lat: 32.2432, lng: 77.1892 }}
        destinationName={trip.destinationName}
        category={destinationCategory}
        startDate={trip.startDate}
        endDate={trip.endDate}
        durationDays={trip.itinerary?.days?.length || 4}
      />

      {/* Packing Checklist Component */}
      <PackingChecklist trip={trip} destinationCategory={destinationCategory} />


      {/* Trip Notes & Reminders */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            <span>Trip Notes & Reminders</span>
          </h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              Edit Notes
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none h-28 focus:border-sky-500"
              placeholder="Add packing reminders, flight codes, emergency contacts, or booking reference numbers..."
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditingNotes(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
            {trip.notes || 'No notes added yet. Click "Edit Notes" to add passport reminders, hotel confirmation numbers, or packing gear.'}
          </p>
        )}
      </div>

    </div>
  );
};

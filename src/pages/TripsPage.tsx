import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, Plus, Trash2, Copy, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';

export const TripsPage: React.FC = () => {
  const { trips, deleteTrip, duplicateTrip, formatPrice } = useTravel();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredTrips = trips.filter(trip => {
    if (filterStatus === 'All') return true;
    return trip.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      <SEOHead
        title="My Planned Trips — Saved Itineraries & Booking Management"
        description="View and manage your upcoming vacations, saved itineraries, packing checklists, and budget allocations in MovePlanner."
        keywords="my trips, saved itineraries, trip management, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            Personal Dashboard
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
            My Planned Trips
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your active adventures, day-by-day itineraries, and budget tracking in guest or account mode.
          </p>
        </div>

        <Link
          to="/itinerary-planner"
          className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Trip</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        {['All', 'Planning', 'Confirmed', 'Completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all ${
              filterStatus === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        trip.status === 'Completed'
                          ? 'bg-emerald-600 text-white'
                          : trip.status === 'Confirmed'
                          ? 'bg-sky-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => duplicateTrip(trip.id)}
                      className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
                      title="Duplicate trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${trip.title}"?`)) {
                          deleteTrip(trip.id);
                        }
                      }}
                      className="p-2 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors"
                      title="Delete trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{trip.startDate} to {trip.endDate}</span>
                    <span>&bull;</span>
                    <span>{trip.travellers.adults} Adults ({trip.travellers.type})</span>
                  </div>

                  <Link to={`/trips/${trip.id}`} className="block hover:text-sky-600 transition-colors">
                    <h3 className="font-serif text-xl font-bold text-slate-900">
                      {trip.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {trip.notes || 'No trip notes added yet.'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Estimated Budget</span>
                      <span className="font-bold text-slate-800 text-sm">{formatPrice(trip.totalBudget)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Itinerary Days</span>
                      <span className="font-bold text-slate-800 text-sm">{trip.itinerary?.days?.length || 1} Planned Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/trips/${trip.id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Trip Overview
                </Link>

                <Link
                  to={`/itinerary/${trip.itinerary?.id || trip.id}`}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Open Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-lg">No trips found</h3>
          <p className="text-xs text-slate-500">Create your first personalized travel itinerary with our wizard!</p>
          <Link
            to="/itinerary-planner"
            className="inline-block px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20"
          >
            Launch Wizard
          </Link>
        </div>
      )}

    </div>
  );
};

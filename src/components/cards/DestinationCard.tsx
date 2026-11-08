import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { Destination } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface DestinationCardProps {
  destination: Destination;
  compact?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, compact = false }) => {
  const { isDestinationSaved, toggleSaveDestination, formatPrice } = useTravel();
  const saved = isDestinationSaved(destination.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Thumbnail */}
      <div className={`relative w-full ${compact ? 'h-44' : 'h-52'} overflow-hidden bg-slate-100`}>
        <img
          src={destination.heroImage}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
            {destination.category}
          </span>
        </div>

        {/* Save Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveDestination(destination.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save destination'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        {/* Ideal for pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 flex-wrap">
          {destination.idealFor.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-900/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{destination.stateOrRegion}, {destination.country}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating}</span>
              <span className="text-slate-400 font-normal">({destination.reviewCount})</span>
            </div>
          </div>

          <Link to={`/destinations/${destination.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {destination.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {destination.tagline}
          </p>
        </div>

        {/* Footer with budget & duration */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Est. Daily Budget</span>
            <span className="font-bold text-slate-800 text-sm">
              {formatPrice(destination.estimatedDailyBudget.midRange)}
            </span>
            <span className="text-[10px] text-slate-400">/day</span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Duration</span>
            <span className="font-medium text-slate-700">{destination.durationDaysRecommended}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

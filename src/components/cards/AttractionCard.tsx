import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Clock, Ticket, MapPin } from 'lucide-react';
import { Attraction } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface AttractionCardProps {
  attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const { isAttractionSaved, toggleSaveAttraction, formatPrice } = useTravel();
  const saved = isAttractionSaved(attraction.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={attraction.image}
          alt={attraction.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs">
            {attraction.category}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveAttraction(attraction.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={saved ? 'Remove attraction from saved' : 'Save attraction'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        {/* Timings pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-sky-300" />
          <span>{attraction.estimatedDurationHours}h visit &bull; {attraction.openingHours}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-500">
              {attraction.destinationName}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{attraction.rating}</span>
              <span className="text-slate-400 font-normal">({attraction.reviewCount})</span>
            </div>
          </div>

          <Link to={`/attractions/${attraction.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {attraction.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {attraction.description}
          </p>
        </div>

        <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900">
                {attraction.entryFee.isFree
                  ? 'Free Entry'
                  : formatPrice(attraction.entryFee.adultPrice || 0)}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {attraction.entryFee.isFree ? 'No ticket needed' : 'per adult entry'}
              </span>
            </div>
          </div>

          <Link
            to={`/attractions/${attraction.slug}`}
            className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-xl transition-all"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, CheckCircle2, BedDouble } from 'lucide-react';
import { Hotel } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { isHotelSaved, toggleSaveHotel, formatPrice } = useTravel();
  const saved = isHotelSaved(hotel.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
      {/* Image Thumbnail */}
      <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
        <img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
            {hotel.type}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveHotel(hotel.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label={saved ? 'Remove hotel from saved' : 'Save hotel'}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="line-clamp-1">{hotel.destinationName} &bull; {hotel.distanceFromCenterKm} km from center</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.rating}</span>
              <span className="text-slate-400 font-normal">({hotel.reviewCount})</span>
            </div>
          </div>

          <Link to={`/hotels/${hotel.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {hotel.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {hotel.locationAddress}
          </p>

          {/* Amenities tags */}
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing footer & CTA */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                {formatPrice(hotel.pricePerNight)}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
              {hotel.originalPricePerNight && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(hotel.originalPricePerNight)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">Sample estimate &bull; taxes included</span>
          </div>

          <Link
            to={`/hotels/${hotel.slug}`}
            className="px-4 py-2 text-xs font-semibold text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-xl transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

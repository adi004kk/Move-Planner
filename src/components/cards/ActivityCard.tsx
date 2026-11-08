import React from 'react';
import { Star, Clock, Compass, Check, ArrowRight } from 'lucide-react';
import { Activity } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { formatPrice, showToast } = useTravel();

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={activity.image}
          alt={activity.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs">
            {activity.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activity.difficulty === 'Easy'
                ? 'bg-emerald-100 text-emerald-800'
                : activity.difficulty === 'Moderate'
                ? 'bg-sky-100 text-sky-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {activity.difficulty}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-sky-300" />
          <span>{activity.duration}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-500">
              {activity.destinationName} &bull; Best: {activity.bestSeason}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{activity.rating}</span>
              <span className="text-slate-400 font-normal">({activity.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {activity.name}
          </h3>

          <ul className="mt-2.5 space-y-1">
            {activity.includes.slice(0, 3).map((item) => (
              <li key={item} className="text-xs text-slate-600 flex items-center gap-1.5">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Starting from</span>
            <span className="text-base font-bold text-slate-900">
              {formatPrice(activity.pricePerPerson)}
            </span>
            <span className="text-[10px] text-slate-400"> / person</span>
          </div>

          <button
            onClick={() => showToast(`Added "${activity.name}" to your trip wishlist!`)}
            className="px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:text-white bg-sky-50 hover:bg-sky-600 rounded-xl transition-all flex items-center gap-1"
          >
            <span>Add to Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

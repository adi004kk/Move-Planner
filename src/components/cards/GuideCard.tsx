import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { TravelGuide } from '../../types/travel';

interface GuideCardProps {
  guide: TravelGuide;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={guide.coverImage}
          alt={guide.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 shadow-xs">
            {guide.category}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium bg-slate-900/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-sky-300" />
          <span>{guide.readingTimeMinutes} min read</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>By {guide.author}</span>
            <span>&bull;</span>
            <span>{guide.publishedDate}</span>
          </div>

          <Link to={`/travel-guides/${guide.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {guide.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {guide.summary}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {guide.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/travel-guides/${guide.slug}`}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Read Complete Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

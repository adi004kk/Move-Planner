import React, { useState } from 'react';
import { Scale, Check, X, Star, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { Destination } from '../types/travel';
import { useTravel } from '../context/TravelContext';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/seo/SEOHead';


export const ComparePage: React.FC = () => {
  const { formatPrice } = useTravel();

  // Allow selecting up to 3 destinations
  const [selectedDestIds, setSelectedDestIds] = useState<string[]>([
    'dest-manali',
    'dest-goa',
    'dest-jaipur'
  ]);

  const toggleSelectDest = (destId: string) => {
    if (selectedDestIds.includes(destId)) {
      if (selectedDestIds.length > 2) {
        setSelectedDestIds(prev => prev.filter(id => id !== destId));
      }
    } else {
      if (selectedDestIds.length < 3) {
        setSelectedDestIds(prev => [...prev, destId]);
      } else {
        setSelectedDestIds(prev => [prev[1], prev[2], destId]);
      }
    }
  };

  const comparedDestinations = selectedDestIds
    .map(id => DESTINATIONS.find(d => d.id === id))
    .filter(Boolean) as Destination[];

  const comparisonRows = [
    { label: 'Category & Vibe', key: 'category', render: (d: Destination) => d.category },
    { label: 'Country & State', key: 'region', render: (d: Destination) => `${d.stateOrRegion}, ${d.country}` },
    {
      label: 'Recommended Stay',
      key: 'duration',
      render: (d: Destination) => d.durationDaysRecommended
    },
    {
      label: 'Mid-Range Daily Budget',
      key: 'budget',
      render: (d: Destination) => (
        <span className="font-extrabold text-sky-700">
          {formatPrice(d.estimatedDailyBudget.midRange)}/day
        </span>
      )
    },
    {
      label: 'Backpacker Budget',
      key: 'budget-low',
      render: (d: Destination) => formatPrice(d.estimatedDailyBudget.budget) + '/day'
    },
    {
      label: 'Peak Season',
      key: 'peak',
      render: (d: Destination) => d.bestTimeToVisit.bestMonths.slice(0, 3).join(', ')
    },
    {
      label: 'Ideal For',
      key: 'ideal',
      render: (d: Destination) => (
        <div className="flex flex-wrap gap-1">
          {d.idealFor.map(t => (
            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
              {t}
            </span>
          ))}
        </div>
      )
    },
    {
      label: 'Signature Food',
      key: 'food',
      render: (d: Destination) => d.localCuisine.slice(0, 3).join(', ')
    },
    {
      label: 'Safety Score',
      key: 'safety',
      render: (d: Destination) => (
        <span className="font-bold text-emerald-600">{d.safetyRating} / 5.0</span>
      )
    },
    {
      label: 'Transit Options',
      key: 'transit',
      render: (d: Destination) => d.localTransportOptions.slice(0, 2).join(', ')
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <SEOHead
        title="Compare Destinations Side-by-Side — Budgets, Weather & Safety"
        description="Compare up to 3 travel destinations side-by-side. Analyze daily budgets, best season to visit, safety ratings, and highlights to pick your next getaway."
        keywords="compare destinations, travel comparison, budget comparison, vacation showdown, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Decision Tool
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Compare Destinations Side-by-Side
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Torn between a beach holiday or a mountain retreat? Compare daily expenses, ideal trip durations, peak seasons, and local flavors.
        </p>

        {/* Destination Selector Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Select 2 to 3 destinations to compare:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {DESTINATIONS.map(d => {
              const isSelected = selectedDestIds.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggleSelectDest(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {d.name} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 sm:p-6 w-1/4 font-serif font-bold text-slate-900 text-sm">
                Comparison Feature
              </th>
              {comparedDestinations.map(d => (
                <th key={d.id} className="p-4 sm:p-6 font-serif font-bold text-slate-900 text-sm border-l border-slate-200">
                  <div className="space-y-2">
                    <img src={d.heroImage} alt={d.name} className="w-full h-28 rounded-xl object-cover" />
                    <div>
                      <span className="text-base font-bold text-slate-900 block">{d.name}</span>
                      <span className="text-slate-500 text-xs font-normal">{d.country}</span>
                    </div>
                    <Link
                      to={`/destinations/${d.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700"
                    >
                      <span>View Full Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                <td className="p-4 sm:p-5 font-bold text-slate-700">
                  {row.label}
                </td>
                {comparedDestinations.map(d => (
                  <td key={d.id} className="p-4 sm:p-5 text-slate-600 border-l border-slate-100">
                    {row.render(d)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Insights */}
      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 sm:p-8 space-y-2">
        <h3 className="font-serif font-bold text-sky-950 text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-600" />
          <span>MovePlanner Comparison Summary</span>
        </h3>
        <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
          For relaxation and coastal cafe dining, <strong>Goa</strong> offers leisurely shacks and Portuguese architecture. If you crave brisk mountain air, alpine pine forests, and high-adrenaline paragliding, <strong>Manali</strong> is ideal. For magnificent royal palaces, vibrant bazaars, and opulent heritage, <strong>Jaipur</strong> shines brightly.
        </p>
      </div>

    </div>
  );
};

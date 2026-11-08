import React, { useState } from 'react';
import { Bus, Train, Plane, Car, Navigation, Calculator, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { RoutingService } from '../services/apiAdapters';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';


export const TransportPage: React.FC = () => {
  const { formatPrice } = useTravel();

  const [inputDistance, setInputDistance] = useState<number>(12);
  const transitEstimate = RoutingService.getEstimatedTransit(inputDistance);

  const transitModes = [
    {
      title: 'App-Based Cabs & Ride Hailing',
      icon: Car,
      color: 'text-sky-600 bg-sky-50',
      description: 'The most reliable way to avoid meter disputes. Use official apps: Uber and Ola across India; GoaMiles exclusively in Goa; Grab in Singapore & Bali; Careem in Dubai.',
      tips: ['Never cancel an app ride to negotiate cash with the driver', 'Check driver license plate before boarding']
    },
    {
      title: 'Local Auto-Rickshaws & Tuk-Tuks',
      icon: Bus,
      color: 'text-amber-600 bg-amber-50',
      description: 'Iconic three-wheelers ideal for short city hops and narrow historic bazaars (Jaipur, Varanasi, Rishikesh, Bangkok).',
      tips: ['Pre-agree on total fare before stepping in if the driver refuses the meter', 'Keep smaller currency notes handy']
    },
    {
      title: 'Metro & Urban Mass Rapid Transit',
      icon: Train,
      color: 'text-indigo-600 bg-indigo-50',
      description: 'Fast, air-conditioned, and immune to road gridlock. Modern systems include Jaipur Metro, Singapore MRT, Dubai driverless Metro, and Paris Métro.',
      tips: ['Singapore and Paris accept contactless credit card taps directly at turnstiles', 'Avoid morning peak rush hours 8:30 AM to 9:45 AM']
    },
    {
      title: 'Scenic Ferries & Waterway Boats',
      icon: Navigation,
      color: 'text-emerald-600 bg-emerald-50',
      description: 'Waterborne transport is integral to coastal hubs: Kerala houseboats, Andaman Makruzz catamarans, Dal Lake shikaras, and Venice of the East boats on Lake Pichola.',
      tips: ['Always confirm lifejackets are provided before cast-off', 'Book high-speed island ferries 2-3 days in advance during high season']
    }
  ];

  const cityTransitHacks = [
    { city: 'Goa', tip: 'Renting an Activa scooty (₹400-600/day) is the most flexible way to explore North and South Goa. Always wear a helmet — traffic police enforce this strictly.' },
    { city: 'Manali', tip: 'To cross the Atal Tunnel into Lahaul or climb to Rohtang Pass, hire a union-certified 4x4 vehicle. Mountain roads require experienced high-altitude drivers.' },
    { city: 'Singapore', tip: 'No need to purchase tourist transit passes. Simply tap your contactless Visa/Mastercard credit card or Apple/Google Pay at every MRT and bus gantry.' },
    { city: 'Kyoto', tip: 'Kyoto’s extensive bus network covers almost all temples. Purchase an ICOCA/Suica card to tap on buses and private electric train lines.' }
  ];

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title="Local Transportation Guide & Fare Estimator — Metro, Cabs & Ferries"
        description="Comprehensive guide to getting around safely. Ride-hailing apps, metro transit networks, scooter rentals, and interactive transit fare calculator."
        keywords="local transportation, transit fare estimator, metro guide, airport transfer, MovePlanner"
      />
      
      {/* Header Banner */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Getting Around
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-900 mt-1">
          Local Transportation Guide
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Everything you need to navigate city metros, scooter rentals, mountain taxis, and island catamarans smoothly and safely.
        </p>
      </div>

      {/* Interactive Transit Fare Estimator */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
              <Calculator className="w-3.5 h-3.5" />
              <span>Fare & Distance Estimator</span>
            </div>
            <h2 className="font-serif text-2xl font-bold mt-2">Calculate Local Transit Costs</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Estimate travel time and sample fares across different modes for any city distance.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
            <span className="text-xs text-slate-300 font-medium">Distance:</span>
            <input
              type="range"
              min="1"
              max="60"
              value={inputDistance}
              onChange={(e) => setInputDistance(Number(e.target.value))}
              className="w-28 sm:w-40 accent-sky-400 cursor-pointer"
            />
            <span className="text-base font-extrabold text-sky-400 min-w-12 text-right">
              {inputDistance} km
            </span>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {transitEstimate.modes.map((mode) => (
            <div key={mode.mode} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">{mode.mode}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(mode.estimatedCostInr)}
                </span>
                <span className="text-xs text-sky-300 font-medium">~{mode.durationMinutes} mins</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Sample estimate based on typical city traffic</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transit Modes Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transitModes.map((mode) => {
          const Icon = mode.icon;
          return (
            <div key={mode.title} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${mode.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">{mode.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {mode.description}
              </p>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Pro Tips
                </span>
                <ul className="space-y-1.5">
                  {mode.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* City Transit Hacks */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <span>Destination Transit Cheat-Sheet</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {cityTransitHacks.map(item => (
            <div key={item.city} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm block mb-1">{item.city}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{item.tip}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

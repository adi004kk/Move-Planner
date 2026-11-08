import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Footprints,
  Car,
  Hotel,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { ItineraryService } from '../services/apiAdapters';
import { useTravel } from '../context/TravelContext';
import { Trip, Currency } from '../types/travel';
import { SEOHead } from '../components/seo/SEOHead';


export const ItineraryPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDestSlug = searchParams.get('destination');

  const { createTrip, currency, formatPrice } = useTravel();

  // Wizard state: 1 to 9
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedDestId, setSelectedDestId] = useState<string>(() => {
    const found = DESTINATIONS.find(d => d.slug === preselectedDestSlug);
    return found ? found.id : 'dest-manali';
  });

  const [startDate, setStartDate] = useState<string>('2026-11-15');
  const [endDate, setEndDate] = useState<string>('2026-11-18');
  const [isFlexibleDates, setIsFlexibleDates] = useState<boolean>(false);

  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [travelerType, setTravelerType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Couple');

  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Mid-Range' | 'Luxury'>('Mid-Range');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);

  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Culture', 'Food', 'Nature']);
  const [travelStyle, setTravelStyle] = useState<'Relaxed' | 'Balanced' | 'Fast-Paced'>('Balanced');

  const [transportPref, setTransportPref] = useState<string>('Private Cabs & Auto-rickshaws');
  const [accommodationPref, setAccommodationPref] = useState<string>('Boutique Hotel / Resort');

  const selectedDestination = DESTINATIONS.find(d => d.id === selectedDestId) || DESTINATIONS[0];

  // Calculate days difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

  // Toggle interest
  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? (prev.length > 1 ? prev.filter(i => i !== interest) : prev)
        : [...prev, interest]
    );
  };

  const handleGenerateItinerary = () => {
    const generatedItinerary = ItineraryService.generateDeterministicItinerary({
      destination: selectedDestination,
      daysCount: daysDiff,
      travelStyle,
      interests: selectedInterests,
      budgetTier
    });

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: `${daysDiff}-Day ${selectedDestination.name} Adventure`,
      destinationName: selectedDestination.name,
      destinationId: selectedDestination.id,
      startDate,
      endDate,
      travellers: {
        adults,
        children,
        type: travelerType
      },
      totalBudget: generatedItinerary.estimatedTotalCost * (adults + children * 0.5),
      currency: selectedCurrency,
      travelStyle,
      transportPreference: transportPref,
      accommodationPreference: accommodationPref,
      status: 'Planning',
      coverImage: selectedDestination.heroImage,
      itinerary: generatedItinerary,
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Generated trip with MovePlanner. Interests: ${selectedInterests.join(', ')}.`
    };

    createTrip(newTrip);
    navigate(`/itinerary/${generatedItinerary.id}`);
  };

  const allInterests = [
    'Nature & Landscapes', 'Adventure Sports', 'Food & Local Dining', 'Culture & Heritage',
    'Historical Monuments', 'Shopping & Bazaars', 'Spiritual Peace', 'Relaxation & Spa', 'Photography'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <SEOHead
        title="Smart Trip Itinerary Planner & Day-by-Day Wizard"
        description="Craft personalized travel itineraries step-by-step. Select destinations, traveler styles, daily budgets, hotel preferences, and generate complete day-by-day routes."
        keywords="itinerary planner, trip planner, day-by-day travel route, vacation planner, MovePlanner"
      />
      
      {/* Wizard Header & Progress Bar */}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">Trip Creation Wizard</h1>
              <p className="text-xs text-slate-500">Step {currentStep} of 9 &bull; Fast, deterministic trip builder</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 font-medium"
            title="Restart Wizard"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-600 to-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Panels */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md min-h-[420px] flex flex-col justify-between">
        
        {/* STEP 1: DESTINATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 1</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Choose your destination</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select from our vetted global hubs.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-80 overflow-y-auto pr-1">
              {DESTINATIONS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDestId(d.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    selectedDestId === d.id
                      ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={d.heroImage} alt={d.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-xs sm:text-sm">{d.name}</h3>
                    <span className="text-[10px] text-slate-500 block">{d.stateOrRegion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DATES */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 2</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">When are you traveling?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Pick departure and return dates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Trip Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Trip End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-sm font-semibold text-slate-900 bg-white p-2.5 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
              <span className="font-semibold">Calculated Duration:</span>
              <span className="font-extrabold text-sm text-sky-950">{daysDiff} Days / {Math.max(1, daysDiff - 1)} Nights</span>
            </div>
          </div>
        )}

        {/* STEP 3: TRAVELLERS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 3</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Who is going with you?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tailor activities for party dynamics.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Solo', 'Couple', 'Friends', 'Family'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setTravelerType(type);
                    if (type === 'Solo') setAdults(1);
                    if (type === 'Couple') setAdults(2);
                  }}
                  className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                    travelerType === type
                      ? 'border-sky-600 bg-sky-50 text-sky-800 ring-2 ring-sky-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Adults</span>
                  <span className="text-[10px] text-slate-400">Age 13+</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 font-bold"
                  >+</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Children</span>
                  <span className="text-[10px] text-slate-400">Age 0-12</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 font-bold"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 4</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">What is your budget tier?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Controls hotel price ceilings and restaurant choices.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { tier: 'Budget' as const, desc: 'Hostels, local diners, public transit', cost: selectedDestination.estimatedDailyBudget.budget },
                { tier: 'Mid-Range' as const, desc: '3-star hotels, rooftop cafes, cabs', cost: selectedDestination.estimatedDailyBudget.midRange },
                { tier: 'Luxury' as const, desc: '5-star resorts, fine dining, private guides', cost: selectedDestination.estimatedDailyBudget.luxury }
              ].map(item => (
                <button
                  key={item.tier}
                  onClick={() => setBudgetTier(item.tier)}
                  className={`p-5 rounded-2xl border text-left space-y-2 transition-all ${
                    budgetTier === item.tier
                      ? 'border-sky-600 bg-sky-50/70 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-sm text-slate-900 block">{item.tier}</span>
                  <span className="text-xl font-extrabold text-sky-700 block">{formatPrice(item.cost)}/day</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: INTERESTS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 5</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">What are your top interests?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Select at least 2 themes to shape your daily stops.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allInterests.map(interest => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3.5 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{interest}</span>
                    {active && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: TRAVEL STYLE */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 6</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Pacing & Daily Style</h2>
              <p className="text-xs text-slate-500 mt-0.5">How many activities per day do you prefer?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { style: 'Relaxed' as const, stops: '1-2 stops/day', desc: 'Sleep in, long cafe meals, gentle strolls' },
                { style: 'Balanced' as const, stops: '2-3 stops/day', desc: 'Core sights in morning, leisure afternoon & evening' },
                { style: 'Fast-Paced' as const, stops: '4+ stops/day', desc: 'Maximum sightseeing from early sunrise to night' }
              ].map(item => (
                <button
                  key={item.style}
                  onClick={() => setTravelStyle(item.style)}
                  className={`p-5 rounded-2xl border text-left space-y-1.5 transition-all ${
                    travelStyle === item.style
                      ? 'border-sky-600 bg-sky-50/70 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-sm text-slate-900 block">{item.style}</span>
                  <span className="text-xs font-semibold text-sky-700 block">{item.stops}</span>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: TRANSPORTATION */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 7</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Preferred Local Transport</h2>
              <p className="text-xs text-slate-500 mt-0.5">How will you move between stops?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                'Private Cabs & Auto-rickshaws',
                'Rented Two-Wheeler / Scooter',
                'Public Metro & Walking',
                'Private 4x4 with Dedicated Driver'
              ].map(pref => (
                <button
                  key={pref}
                  onClick={() => setTransportPref(pref)}
                  className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                    transportPref === pref
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: ACCOMMODATION */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Step 8</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Accommodation Type</h2>
              <p className="text-xs text-slate-500 mt-0.5">Where will you rest at night?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                'Boutique Hotel / Resort',
                'Social Backpacker Hostel',
                'Heritage Haveli / Palace',
                'Private Homestay & Villa'
              ].map(pref => (
                <button
                  key={pref}
                  onClick={() => setAccommodationPref(pref)}
                  className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                    accommodationPref === pref
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: GENERATE & CONFIRM */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 9 &bull; Ready</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">Review & Generate Plan</h2>
              <p className="text-xs text-slate-500 mt-0.5">All parameters are validated and ready.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                <span className="font-bold text-slate-900">{selectedDestination.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Trip Duration</span>
                <span className="font-bold text-slate-900">{daysDiff} Days</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Party</span>
                <span className="font-bold text-slate-900">{adults} Adults {children > 0 ? `+ ${children} Kids` : ''} ({travelerType})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget Tier</span>
                <span className="font-bold text-slate-900">{budgetTier}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pacing</span>
                <span className="font-bold text-slate-900">{travelStyle}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Transport</span>
                <span className="font-bold text-slate-900 line-clamp-1">{transportPref}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
              <p className="text-xs text-sky-900">
                Clicking <strong>Generate Custom Itinerary</strong> will synthesize morning sights, local lunch spots, evening adventures, and geographic distances into an interactive day-by-day builder.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 9 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerateItinerary}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Custom Itinerary</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

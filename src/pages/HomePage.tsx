import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Calendar,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  Sun,
  Flame,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { DESTINATIONS, SAMPLE_ITINERARIES, TRAVEL_GUIDES } from '../data/travelData';
import { DestinationCard } from '../components/cards/DestinationCard';
import { GuideCard } from '../components/cards/GuideCard';
import { SEOHead } from '../components/seo/SEOHead';
import { useTravel } from '../context/TravelContext';


export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { formatPrice } = useTravel();

  // Hero search bar state
  const [destinationQuery, setDestinationQuery] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [travellersCount, setTravellersCount] = useState('2');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destinationQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(destinationQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const categories = ['All', 'Hill Station', 'Beach', 'Heritage & Culture', 'Spiritual', 'Adventure', 'Urban & Modern'];

  const filteredDestinations = selectedCategory === 'All'
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.category === selectedCategory);

  const weekendGetaways = DESTINATIONS.filter(d =>
    ['dest-manali', 'dest-rishikesh', 'dest-jaipur', 'dest-udaipur'].includes(d.id)
  );

  const budgetFriendlyDestinations = DESTINATIONS.filter(
    d => d.estimatedDailyBudget.budget <= 2000
  );

  const internationalDestinations = DESTINATIONS.filter(d => d.country !== 'India');

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEOHead
        title="MovePlanner — Plan Smarter, Explore More, Travel Better"
        description="The ultimate all-in-one travel planning platform. Discover worldwide destinations, compare hotel prices, build custom day-by-day itineraries, and track travel budgets."
        keywords="travel planner, itinerary builder, trip planner, travel guides, destination discovery, hotel booking, budget planner, packing checklist, MovePlanner"
      />
      
      {/* 1. HERO SECTION */}

      <section className="relative min-h-[620px] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-6 sm:p-12 lg:p-16">
        {/* Background Image with Cinematic Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic Himalayan Valley"
            className="w-full h-full object-cover scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Discover 20+ Curated Global Destinations & AI Itineraries</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Your next adventure <br className="hidden sm:inline" />starts here.
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            MovePlanner unites destination discovery, hotels, food, local transport, day-by-day itineraries, and real budget tracking in one seamless platform.
          </p>

          {/* Unified Search Control Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40 max-w-3xl mx-auto text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* Destination Input */}
              <div className="sm:col-span-5 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Where to?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Manali, Goa, Singapore..."
                    value={destinationQuery}
                    onChange={(e) => setDestinationQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 focus-within:border-sky-500 focus-within:bg-white transition-all">
                <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Dates
                  </label>
                  <input
                    type="date"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full text-xs font-medium text-slate-700 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Travellers & Submit */}
              <div className="sm:col-span-3 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80">
                  <Users className="w-4 h-4 text-slate-500 shrink-0" />
                  <select
                    value={travellersCount}
                    onChange={(e) => setTravellersCount(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-transparent outline-none"
                  >
                    <option value="1">1 Solo</option>
                    <option value="2">2 Couple</option>
                    <option value="3">3 Friends</option>
                    <option value="4">4+ Family</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/30 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
                  aria-label="Explore"
                >
                  <Search className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">Explore</span>
                </button>
              </div>

            </form>

            {/* Popular quick tag suggestions */}
            <div className="flex items-center gap-2 flex-wrap pt-3 mt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Popular:</span>
              {['Manali', 'Goa', 'Jaipur', 'Leh-Ladakh', 'Bali', 'Singapore', 'Kyoto'].map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => {
                    setDestinationQuery(dest);
                    navigate(`/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 text-xs font-medium transition-colors"
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITION HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Interactive Itineraries', desc: 'Customizable day-by-day plans with transit times and real cost breakdowns.', icon: Sparkles, color: 'text-sky-600 bg-sky-50' },
          { title: 'Realistic Budgets', desc: 'Itemized expense calculators supporting INR, USD, EUR, and GBP currencies.', icon: Award, color: 'text-indigo-600 bg-indigo-50' },
          { title: 'Live Geo Maps', desc: 'Leaflet map with pinpoints for attractions, hotels, street food, and treks.', icon: MapPin, color: 'text-amber-600 bg-amber-50' },
          { title: '100% Guest Friendly', desc: 'No signup wall. Create trips, bookmark favorites, and export itineraries offline.', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' }
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.title} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">{feat.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* 3. POPULAR DESTINATIONS WITH CATEGORY TABS */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Discover Places</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Carefully curated guides with verified attractions, food hotspots, and hotel picks.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.slice(0, 8).map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      {/* 4. TRIP PLANNING WIZARD CTA BANNER */}
      <section className="relative bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 inline-block">
            Intelligent Multi-Step Planner
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
            Build a custom day-by-day trip in under 60 seconds
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select your travel dates, budget style, party size, and travel pace. Our algorithm synthesizes attractions, dining, and scenic routes into an editable itinerary.
          </p>
          <div className="pt-2">
            <Link
              to="/itinerary-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Launch Trip Creation Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:flex items-center justify-center">
          <Compass className="w-72 h-72 text-white" />
        </div>
      </section>

      {/* 5. WEEKEND GETAWAYS FROM METROS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Quick Escapes</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Weekend Getaways
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ideal 3 to 4 day road trips and quick flights with low transit fatigue.
            </p>
          </div>
          <Link to="/explore?category=Hill+Station" className="text-xs font-bold text-sky-600 hover:text-sky-700">
            Explore All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {weekendGetaways.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} compact />
          ))}
        </div>
      </section>

      {/* 6. SAMPLE ITINERARIES PREVIEW */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Ready-Made Plans</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Recommended Itineraries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Field-tested itineraries with realistic morning-to-night schedules and budgets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_ITINERARIES.map((itin) => (
            <div
              key={itin.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                    {itin.durationDays} Days &bull; {itin.travelStyle}
                  </span>
                  <span className="font-bold text-slate-800">
                    Est. Total: {formatPrice(itin.estimatedTotalCost)}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 mt-2">
                  {itin.title}
                </h3>

                <div className="mt-4 space-y-2.5">
                  {itin.days.slice(0, 2).map((day) => (
                    <div key={day.dayNumber} className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                        {day.dayNumber}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 block">{day.title}</span>
                        <span className="text-slate-500 line-clamp-1">
                          {day.stops.map(s => s.placeName).join(' &bull; ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {itin.days.length} fully planned days
                </span>
                <Link
                  to={`/itinerary/${itin.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRAVEL GUIDES HIGHLIGHT */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Expert Advice</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Curated Travel Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Insider advice on packing light, avoiding tourist scams, and traveling solo.
            </p>
          </div>
          <Link to="/travel-guides" className="text-xs font-bold text-sky-600 hover:text-sky-700">
            View All Guides &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_GUIDES.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </section>

    </div>
  );
};

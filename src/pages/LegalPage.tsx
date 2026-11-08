import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <SEOHead
        title={isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        description={`Read MovePlanner's ${isPrivacy ? 'Privacy Policy regarding transparent data usage, local storage, and privacy rights' : 'Terms of Service regarding platform usage, planning features, and community conduct'}.`}
        keywords="privacy policy, terms of service, MovePlanner legal"
      />
      
      {/* Back button */}

      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              Legal Documentation
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-slate-900">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h1>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Last updated: October 2026 &bull; Effective for all MovePlanner visitors and registered accounts
        </p>

        <div className="pt-4 border-t border-slate-100 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {isPrivacy ? (
            <>
              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">1. Commitment to Traveler Privacy</h2>
                <p>
                  At MovePlanner, we believe your travel plans, destinations, and budgets belong to you. We do not sell user data, itinerary searches, or location tracking to commercial third parties or aggressive advertising networks.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">2. Local Storage and Guest Mode</h2>
                <p>
                  By default, MovePlanner functions completely without mandatory registration. Your saved destinations, custom trips, itemized expenses, and packing checklists are stored directly in your browser’s local storage. This data never leaves your device unless you explicitly export a JSON backup.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">3. External Map Tiles and Geocoding</h2>
                <p>
                  Interactive maps are rendered via OpenStreetMap and Leaflet. Map tile requests do not transmit personal profile details, passwords, or payment credentials.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">1. Agreement to Terms</h2>
                <p>
                  By accessing or using MovePlanner, you agree to these Terms of Service. If you do not agree, you may discontinue use of the platform at any time.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">2. Planning Prototype & Demo Content Notice</h2>
                <p>
                  MovePlanner provides curated travel information, opening hours, estimated daily expenses, and sample itineraries for realistic travel planning. All prices and timings are provided for demonstration purposes. Users must independently verify operating hours and ticket prices with official heritage monuments or hotel operators prior to making non-refundable travel purchases.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="font-serif font-bold text-slate-900 text-lg">3. Limitation of Liability</h2>
                <p>
                  MovePlanner is not a licensed carrier, travel insurer, or consular visa agent. We assume no legal liability for airline schedule changes, weather-induced mountain pass closures (such as Rohtang or Khardung La), or personal property loss while traveling.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link
            to={isPrivacy ? '/terms' : '/privacy'}
            className="font-bold text-sky-600 hover:underline"
          >
            {isPrivacy ? 'Read Terms of Service &rarr;' : 'Read Privacy Policy &rarr;'}
          </Link>
          <Link to="/contact" className="text-slate-500 hover:text-slate-800">
            Have legal questions? Contact us
          </Link>
        </div>

      </div>

    </div>
  );
};

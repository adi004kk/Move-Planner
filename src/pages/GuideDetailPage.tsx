import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, User, Share2, Heart, ArrowLeft, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { TRAVEL_GUIDES, DESTINATIONS } from '../data/travelData';
import { useTravel } from '../context/TravelContext';
import { SEOHead } from '../components/seo/SEOHead';

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { showToast } = useTravel();

  const guide = TRAVEL_GUIDES.find(g => g.slug === slug || g.id === slug) || TRAVEL_GUIDES[0];

  const relatedDestinations = DESTINATIONS.filter(d =>
    guide.relatedDestinationSlugs.includes(d.slug)
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Guide link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-20">
      <SEOHead
        title={`${guide.title} — Travel Guide`}
        description={guide.summary.slice(0, 155)}
        image={guide.coverImage}
        type="article"
        keywords={`${guide.tags.join(', ')}, travel guide, MovePlanner`}
        jsonLd={{
          '@type': 'Article',
          headline: guide.title,
          description: guide.summary,
          image: [guide.coverImage],
          author: {
            '@type': 'Person',
            name: guide.author
          },
          publisher: {
            '@type': 'Organization',
            name: 'MovePlanner'
          },
          datePublished: guide.publishedDate
        }}
      />
      
      {/* Top Navigation */}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <Link to="/travel-guides" className="flex items-center gap-1.5 hover:text-sky-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Share guide"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => showToast('Guide saved to your travel library!')}
            className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Bookmark"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
            {guide.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.readingTimeMinutes} min read</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
          {guide.subtitle}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {guide.author.charAt(0)}
            </div>
            <span className="font-medium text-slate-700">{guide.author}</span>
          </div>
          <span>Published {guide.publishedDate}</span>
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden h-72 sm:h-96 w-full bg-slate-100 pt-2 shadow-inner">
          <img
            src={guide.coverImage}
            alt={guide.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Editorial Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Summary Lead */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-100 text-sm text-sky-950 font-medium leading-relaxed">
          {guide.summary}
        </div>

        {/* Dynamic Sections */}
        {guide.contentSections.map((sec, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              {sec.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {sec.text}
            </p>

            {sec.bulletPoints && (
              <ul className="space-y-2 pt-2">
                {sec.bulletPoints.map((bp, bidx) => (
                  <li key={bidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Tags */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">Filed under:</span>
          {guide.tags.map(tag => (
            <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

      </div>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Featured Destinations Mentioned in this Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedDestinations.map(d => (
              <Link
                key={d.id}
                to={`/destinations/${d.slug}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-100 transition-colors group"
              >
                <img
                  src={d.heroImage}
                  alt={d.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-sky-600">
                    {d.name}
                  </h4>
                  <p className="text-xs text-slate-500">{d.stateOrRegion}, {d.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </article>
  );
};

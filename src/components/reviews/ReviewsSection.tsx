import React, { useState, useMemo } from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Users,
  Calendar,
  PenLine,
  ArrowUpDown
} from 'lucide-react';
import { Review } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';

interface ReviewsSectionProps {
  targetId: string;
  targetType: 'destination' | 'hotel' | 'attraction' | 'restaurant' | 'guide';
  targetName: string;
  baselineRating?: number;
  baselineReviewCount?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  targetId,
  targetType,
  targetName,
  baselineRating = 4.8,
  baselineReviewCount = 120
}) => {
  const {
    user,
    getReviewsForTarget,
    addReview,
    voteReviewHelpful,
    getTargetRatingSummary
  } = useTravel();

  // State
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'all'>('all');
  const [selectedTravelerFilter, setSelectedTravelerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formTravelerType, setFormTravelerType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business'>('Couple');
  const [formMonth, setFormMonth] = useState('October 2026');
  const [formAuthor, setFormAuthor] = useState(user.name || 'Traveler');
  const [formError, setFormError] = useState('');

  // Fetch reviews & calculated summary
  const targetReviews = getReviewsForTarget(targetId);
  const summary = getTargetRatingSummary(targetId, baselineRating, baselineReviewCount);

  // Filtered & Sorted reviews
  const filteredReviews = useMemo(() => {
    let list = [...targetReviews];

    if (selectedStarFilter !== 'all') {
      list = list.filter(r => Math.round(r.rating) === selectedStarFilter);
    }

    if (selectedTravelerFilter !== 'all') {
      list = list.filter(r => r.travelerType === selectedTravelerFilter);
    }

    list.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      if (sortBy === 'helpful') {
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      }
      return 0;
    });

    return list;
  }, [targetReviews, selectedStarFilter, selectedTravelerFilter, sortBy]);

  const handleOpenModal = () => {
    setFormAuthor(user.name || 'Traveler');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Please provide a short headline for your review.');
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 15) {
      setFormError('Please write at least 15 characters describing your experience.');
      return;
    }
    if (!formAuthor.trim()) {
      setFormError('Please enter your name.');
      return;
    }

    addReview({
      targetId,
      targetType,
      author: formAuthor.trim(),
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      travelerType: formTravelerType,
      monthOfVisit: formMonth
    });

    setIsModalOpen(false);
    setFormTitle('');
    setFormComment('');
    setFormError('');
  };

  const ratingDescriptions: Record<number, string> = {
    5: 'Exceptional — Exceeded all expectations!',
    4: 'Very Good — Great experience, highly recommended.',
    3: 'Average — Met expectations with some room for improvement.',
    2: 'Disappointing — Several issues encountered.',
    1: 'Poor — Would not recommend.'
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
      
      {/* 1. Header with Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wider">
              Traveler Feedback
            </span>
            <span className="text-xs text-slate-400">Verified community reviews</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Ratings & Reviews for {targetName}
          </h2>
        </div>

        <button
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10 shrink-0 cursor-pointer"
        >
          <PenLine className="w-4 h-4 text-sky-400" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* 2. Rating Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60">
        {/* Score & Stars */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:border-r lg:border-slate-200 lg:pr-8">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-5xl font-extrabold text-slate-900">
              {summary.averageRating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm font-semibold">/ 5.0</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Based on <strong className="text-slate-800">{summary.totalCount}</strong> verified travel reviews
          </p>

          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>98% of travelers recommend this place</span>
          </div>
        </div>

        {/* Distribution Bars */}
        <div className="lg:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = summary.distribution[stars as keyof typeof summary.distribution] || 0;
            const percentage = summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0;
            const isSelected = selectedStarFilter === stars;

            return (
              <button
                key={stars}
                onClick={() => setSelectedStarFilter(isSelected ? 'all' : stars)}
                className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${
                  isSelected ? 'bg-sky-100/60 font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 text-slate-700 font-medium">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      stars >= 4 ? 'bg-sky-500 group-hover:bg-sky-600' : stars === 3 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-16 text-right shrink-0 text-slate-500 text-[11px]">
                  <span>{percentage}%</span>
                  <span className="text-slate-400 ml-1">({count})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filters & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Star Rating Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          <button
            onClick={() => setSelectedStarFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedStarFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedStarFilter(star)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStarFilter === star
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Traveler Type & Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedTravelerFilter}
            onChange={(e) => setSelectedTravelerFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">All Traveler Types</option>
            <option value="Couple">Couples</option>
            <option value="Solo">Solo Travelers</option>
            <option value="Family">Families</option>
            <option value="Friends">Friends Group</option>
            <option value="Business">Business</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(selectedStarFilter !== 'all' || selectedTravelerFilter !== 'all') && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-sky-50 px-3 py-2 rounded-xl border border-sky-100">
          <span className="font-medium">
            Filtering by: {selectedStarFilter !== 'all' && `${selectedStarFilter} Stars`}
            {selectedStarFilter !== 'all' && selectedTravelerFilter !== 'all' && ' & '}
            {selectedTravelerFilter !== 'all' && `${selectedTravelerFilter} trips`}
          </span>
          <button
            onClick={() => {
              setSelectedStarFilter('all');
              setSelectedTravelerFilter('all');
            }}
            className="ml-auto text-sky-700 hover:underline font-bold text-[11px] cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* 4. Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => {
            const hasVoted = !!review.userVotedHelpful;

            return (
              <div
                key={review.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all bg-white space-y-3"
              >
                {/* Author row & Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {review.author.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{review.author}</span>
                        {review.isDemo && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {review.travelerType && (
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <Users className="w-3 h-3" />
                            {review.travelerType} Trip
                          </span>
                        )}
                        {review.monthOfVisit && (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {review.monthOfVisit}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="flex items-center gap-2 sm:text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                </div>

                {/* Review Title */}
                {review.title && (
                  <h4 className="font-serif font-bold text-slate-900 text-base leading-snug">
                    {review.title}
                  </h4>
                )}

                {/* Review Body */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {review.comment}
                </p>

                {/* Helpful voting button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-400 text-[11px]">Was this review helpful to your trip planning?</span>
                  
                  <button
                    onClick={() => voteReviewHelpful(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                      hasVoted
                        ? 'bg-sky-100 text-sky-700 border border-sky-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-sky-700 text-sky-700' : ''}`} />
                    <span>Helpful {review.helpfulCount ? `(${review.helpfulCount})` : ''}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No reviews match your selected filters</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting the star rating or traveler type filter, or be the first to post a new review!
            </p>
            <button
              onClick={() => {
                setSelectedStarFilter('all');
                setSelectedTravelerFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 5. Interactive Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Share Your Experience
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Review {targetName}
              </h3>
              <p className="text-xs text-slate-500">
                Help fellow travelers plan smarter by sharing genuine tips, highlights, and advice.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              
              {/* Interactive Star Rating */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeRating = formHoverRating || formRating;
                    const isFilled = star <= activeRating;

                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setFormHoverRating(star)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 fill-slate-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 font-bold text-slate-900 text-sm">
                    {formHoverRating || formRating} / 5
                  </span>
                </div>
                <p className="text-xs text-sky-700 font-medium">
                  {ratingDescriptions[formHoverRating || formRating]}
                </p>
              </div>

              {/* Traveler Type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Who did you travel with?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Couple', 'Solo', 'Family', 'Friends', 'Business'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormTravelerType(type)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        formTravelerType === type
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month of Visit & Reviewer Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    When did you visit?
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="October 2026">October 2026 (Recent)</option>
                    <option value="September 2026">September 2026</option>
                    <option value="August 2026">August 2026</option>
                    <option value="Summer 2026">Summer 2026</option>
                    <option value="Earlier this year">Earlier this year</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Review Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Review Headline *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Unforgettable sunrise views, cozy mountain vibe"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Detailed Review Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Detailed Experience & Practical Tips *
                </label>
                <textarea
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  rows={4}
                  placeholder="Share details about what you enjoyed, recommended activities, best time of day to visit, transport tips, or things to avoid..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-[11px] text-slate-400 block text-right">
                  {formComment.length} characters (minimum 15)
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

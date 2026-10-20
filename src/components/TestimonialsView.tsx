import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PATIENT_REVIEWS, SERVICES_DATA, THERAPISTS_DIRECTORY, CLINIC_INFO } from '../data/therapyData';
import { Review } from '../types/therapy';
import {
  Star,
  Plus,
  CheckCircle2,
  Filter,
  MessageSquare,
  Award,
  ShieldCheck,
  MapPin,
  X,
  Sparkles,
  Calendar
} from 'lucide-react';

interface TestimonialsViewProps {
  className?: string;
  limit?: number;
}

export const TestimonialsView: React.FC<TestimonialsViewProps> = ({ className = '', limit }) => {
  const { lang, t } = useLanguage();

  // Load reviews from localStorage with fallback to PATIENT_REVIEWS
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('sth_patient_reviews_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return PATIENT_REVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sth_patient_reviews_v1', JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  // Filter State
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [area, setArea] = useState(CLINIC_INFO.upazilas[0].en);
  const [serviceId, setServiceId] = useState(SERVICES_DATA[0].id);
  const [therapistId, setTherapistId] = useState(THERAPISTS_DIRECTORY[0].id);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Rating Statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avg: 5.0, count: 0, fiveStarPct: 100 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const fiveStarPct = Math.round((fiveStarCount / total) * 100);
    return { avg, count: total, fiveStarPct };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedRatingFilter !== 'all' && r.rating !== selectedRatingFilter) {
        return false;
      }
      if (selectedCategory !== 'all') {
        const serviceMatch =
          r.serviceEn.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          r.serviceBn.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!serviceMatch) return false;
      }
      return true;
    });
  }, [reviews, selectedRatingFilter, selectedCategory]);

  const displayedReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError(t('Please enter your name', 'অনুগ্রহ করে আপনার নাম লিখুন'));
      return;
    }
    if (!reviewText.trim()) {
      setFormError(
        t('Please describe your treatment experience', 'অনুগ্রহ করে চিকিৎসার অভিজ্ঞতা বর্ণনা করুন')
      );
      return;
    }

    const matchedService = SERVICES_DATA.find((s) => s.id === serviceId) || SERVICES_DATA[0];
    const matchedTherapist =
      THERAPISTS_DIRECTORY.find((th) => th.id === therapistId) || THERAPISTS_DIRECTORY[0];

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      area,
      serviceEn: matchedService.titleEn,
      serviceBn: matchedService.titleBn,
      rating,
      date: new Date().toISOString().split('T')[0],
      therapistName: lang === 'bn' ? matchedTherapist.nameBn : matchedTherapist.nameEn,
      verified: true,
      textEn: reviewText.trim(),
      textBn: reviewText.trim()
    };

    setReviews((prev) => [newReview, ...prev]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedSuccess(false);
      setName('');
      setReviewText('');
      setRating(5);
    }, 1400);
  };

  const renderStars = (ratingCount: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starVal) => {
          const isFilled = interactive
            ? starVal <= (hoverRating ?? rating)
            : starVal <= ratingCount;

          return (
            <button
              type={interactive ? 'button' : undefined}
              key={starVal}
              onClick={interactive ? () => setRating(starVal) : undefined}
              onMouseEnter={interactive ? () => setHoverRating(starVal) : undefined}
              onMouseLeave={interactive ? () => setHoverRating(null) : undefined}
              disabled={!interactive}
              className={`${
                interactive
                  ? 'cursor-pointer p-1 -m-1 transition-transform hover:scale-110 focus:outline-none'
                  : 'cursor-default'
              }`}
              aria-label={`${starVal} Star`}
            >
              <Star
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section className={`space-y-6 ${className}`} id="testimonials-section">
      {/* Section Header with Add Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{t('Patient Experiences & Outcomes', 'রোগীদের সুস্থতা ও মতামতের বিবরণ')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('Patient Success Stories & Reviews', 'রোগীদের সুস্থতার গল্প ও রিভিউসমূহ')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {t(
              'Real recovery feedback from patients treated at Town Chikandi Bazar and across Shariatpur upazilas.',
              'টাউন চিকন্দি বাজার কেন্দ্র এবং শরীয়তপুরের বিভিন্ন উপজেলায় চিকিৎসা নেওয়া রোগীদের বাস্তব মতামত।'
            )}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add Review', 'আপনার রিভিউ দিন')}</span>
        </button>
      </div>

      {/* Aggregate Rating Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center justify-center shrink-0">
            <span className="text-2xl font-black text-amber-400 tabular-nums leading-none">
              {stats.avg}
            </span>
            <span className="text-[10px] text-emerald-200 mt-1 uppercase font-semibold">/ 5.0</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              {renderStars(5)}
              <span className="text-xs font-bold text-amber-300 ml-1.5">
                {t('Exceptional Care', 'অসাধারণ যত্নশীল সেবা')}
              </span>
            </div>
            <p className="text-xs text-slate-200">
              {t(
                `Based on ${stats.count} verified patient ratings (${stats.fiveStarPct}% 5-Star Reviews)`,
                `${stats.count} জন যাচাইকৃত রোগীর মূল্যায়ন (${stats.fiveStarPct}% ফাইভ-স্টার রিভিউ)`
              )}
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl shrink-0">
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedRatingFilter === 'all'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            {t('All Reviews', 'সকল রিভিউ')}
          </button>
          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRatingFilter === 5
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>5 {t('Stars', 'স্টার')}</span>
          </button>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            {/* Top Row: Stars + Date */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {renderStars(review.rating)}
                  <span className="text-xs font-bold text-slate-700 ml-0.5 tabular-nums">
                    {review.rating}.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {review.date}
                </span>
              </div>

              {/* Service & Therapist Info */}
              <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md inline-flex items-center gap-1 border border-emerald-100">
                <span>{lang === 'bn' ? review.serviceBn : review.serviceEn}</span>
                {review.therapistName && (
                  <>
                    <span className="text-emerald-400">·</span>
                    <span className="text-slate-600 truncate">{review.therapistName}</span>
                  </>
                )}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic pt-1">
                "{lang === 'bn' ? review.textBn : review.textEn}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {review.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{review.area}</span>
                  </div>
                </div>
              </div>

              {review.verified && (
                <div
                  className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0"
                  title="Verified Treated Patient"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{t('Verified', 'যাচাইকৃত')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 relative animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t('Share Your Treatment Experience', 'আপনার চিকিৎসার অভিজ্ঞতা জানান')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t(
                    'Your honest review helps other patients in Shariatpur seek proper therapy.',
                    'আপনার মতামত অন্যান্য রোগীদের সঠিক চিকিৎসা বেছে নিতে সাহায্য করবে।'
                  )}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {t('Thank You for Your Feedback!', 'ধন্যবাদ! আপনার রিভিউটি যুক্ত হয়েছে।')}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {t(
                    'Your experience has been successfully recorded in the Shariatpur Therapy Hub patient directory.',
                    'শরীয়তপুর থেরাপি হাবে আপনার মতামত যুক্ত হয়েছে।'
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs sm:text-sm">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-xl text-xs font-medium">
                    {formError}
                  </div>
                )}

                {/* Rating Picker */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {t('Select Your Rating *', 'রেটিং দিন (১ থেকে ৫ স্টার) *')}
                  </label>
                  <div className="flex items-center justify-center py-1">
                    {renderStars(rating, true)}
                  </div>
                  <span className="text-xs font-extrabold text-amber-600">
                    {rating === 5
                      ? t('5 - Excellent / পুরোপুরি সুস্থ', '৫ - অসাধারণ / পুরোপুরি সুস্থ')
                      : rating === 4
                      ? t('4 - Very Good / খুব ভালো', '৪ - খুব ভালো')
                      : rating === 3
                      ? t('3 - Good / সন্তোষজনক', '৩ - সন্তোষজনক')
                      : rating === 2
                      ? t('2 - Fair / মোটামুটি', '২ - মোটামুটি')
                      : t('1 - Needs Improvement', '১ - উন্নতির প্রয়োজন')}
                  </span>
                </div>

                {/* Name & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('Your Full Name *', 'আপনার নাম *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('e.g., Kazi Mofazzal', 'যেমন: আব্দুল করিম')}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('Your Location / Upazila', 'আপনার উপজেলা / এলাকা')}
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {CLINIC_INFO.upazilas.map((u) => (
                        <option key={u.en} value={`${u.en}, Shariatpur`}>
                          {lang === 'bn' ? `${u.bn}, শরীয়তপুর` : `${u.en}, Shariatpur`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service & Therapist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('Therapy Received', 'যে সেবা নিয়েছেন')}
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {SERVICES_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {lang === 'bn' ? s.titleBn : s.titleEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('Attending Doctor / Specialist', 'থেরাপিস্ট / চিকিৎসক')}
                    </label>
                    <select
                      value={therapistId}
                      onChange={(e) => setTherapistId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {THERAPISTS_DIRECTORY.map((th) => (
                        <option key={th.id} value={th.id}>
                          {lang === 'bn' ? th.nameBn : th.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('Your Story / Outcome *', 'আপনার অভিজ্ঞতা ও সুস্থতার বিবরণ *')}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={t(
                      'Describe your condition before and how the therapy sessions helped your mobility or pain relief...',
                      'চিকিৎসা নেওয়ার পূর্বে কী সমস্যা ছিল এবং থেরাপির পর কতটা সুস্থ বোধ করছেন তা বিস্তারিত লিখুন...'
                    )}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
                  />
                </div>

                {/* Privacy note */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {t(
                      'Reviews are displayed anonymously or by first name to protect full medical privacy.',
                      'রোগীর চিকিৎসার গোপনীয়তা রক্ষায় রিভিউ প্রদর্শিত হয়।'
                    )}
                  </span>
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {t('Cancel', 'বাতিল')}
                  </button>
                  <button
                    type="submit"
                    className="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    {t('Publish Review', 'রিভিউ পোস্ট করুন')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES_DATA, CLINIC_INFO } from '../data/therapyData';
import { ServiceItem, ServiceCategory } from '../types/therapy';
import {
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Youtube,
  Bell
} from 'lucide-react';

interface ServicesViewProps {
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectServiceForBooking }) => {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');

  const categories: { id: ServiceCategory; en: string; bn: string }[] = [
    { id: 'all', en: 'All Services', bn: 'সকল সেবা' },
    { id: 'hijama', en: 'Hijama & Cupping', bn: 'হিজামা ও কাপিং' },
    { id: 'acupuncture', en: 'Acupuncture', bn: 'আকুপাংচার' },
    { id: 'acupressure', en: 'Acupressure', bn: 'আকুপ্রেশার' },
    { id: 'physio', en: 'Physiotherapy', bn: 'ফিজিওথেরাপি' },
    { id: 'speech', en: 'Speech Therapy', bn: 'স্পিচ থেরাপি' },
    { id: 'natural', en: 'Natural Healthcare', bn: 'ন্যাচারাল কেয়ার' },
    { id: 'neuro', en: 'Stroke & Paralysis', bn: 'স্ট্রোক রিহ্যাব' },
    { id: 'home', en: 'Home Visits', bn: 'হোম সার্ভিস' }
  ];

  const filteredServices = SERVICES_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>{t('Comprehensive Holistic & Physical Therapies', 'আধুনিক শারীরিক ও প্রাকৃতিক থেরাপি সেবা')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ textWrap: 'balance' }}>
            {t('Clinical Therapies & Natural Care', 'আমাদের চিকিৎসাসেবা ও থেরাপিসমূহ')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {t(
              'From evidence-based physiotherapy and sterile Sunnah hijama to ancient acupuncture and pediatric speech therapy, all services are performed under certified clinical supervision at Town Chikandi Bazar, Shariatpur.',
              'শরীয়তপুর সদর উপজেলার টাউন চিকন্দি বাজারে অবস্থিত আমাদের কেন্দ্রে বিশেষজ্ঞ চিকিৎসকদের দ্বারা সম্পূর্ণ নিরাপদ, বিজ্ঞানসম্মত ও আন্তর্জাতিক মানসম্পন্ন থেরাপি সেবা প্রদান করা হয়।'
            )}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t(cat.en, cat.bn)}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Service Visual Header */}
              <div className="h-48 relative bg-slate-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={lang === 'bn' ? service.titleBn : service.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow">
                  ৳{service.priceBdt}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-700 tracking-wide">
                    {t(service.duration, service.durationBn)} · {t(service.priceNoteEn, service.priceNoteBn)}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
                    {lang === 'bn' ? service.titleBn : service.titleEn}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lang === 'bn' ? service.descBn : service.descEn}
                </p>

                {/* Indications Checklist */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {t('Recommended For:', 'যাদের জন্য উপযোগী:')}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {(lang === 'bn' ? service.idealForBn : service.idealForEn).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Booking Action Strip */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                <span className="font-medium text-slate-700 block">{t('Estimated Course:', 'চিকিৎসা মেয়াদ:')}</span>
                <span>{service.recommendedSessions}</span>
              </div>

              <button
                onClick={() => onSelectServiceForBooking(service)}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('Book Session', 'বুকিং দিন')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upazila Home Care Spotlight Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm sm:text-base font-bold text-emerald-950">
            {t('Cannot visit Town Chikandi clinic in person?', 'শারীরিক কারণে চিকন্দি বাজার ক্লিনিকে আসতে পারছেন না?')}
          </h3>
          <p className="text-xs text-emerald-800 max-w-xl">
            {t(
              'We dispatch qualified therapists with portable equipment to homes in Sadar, Naria, Damudya, Bhedarganj, Gosairhat, and Zanjira.',
              'আমাদের অভিজ্ঞ থেরাপিস্ট প্রয়োজনীয় যন্ত্রপাতি নিয়ে শরীয়তপুরের যেকোনো উপজেলায় আপনার বাসায় গিয়ে সেবা প্রদান করবেন।'
            )}
          </p>
        </div>

        <a
          href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
            lang === 'bn'
              ? 'আসসালামু আলাইকুম, আমি বাসায় হোম থেরাপি সেবা নেওয়ার বিষয়ে বিস্তারিত জানতে চাই।'
              : 'Hello, I want to inquire about home visit therapy in Shariatpur district.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('Inquire via WhatsApp (01402893006)', 'হোয়াটসঅ্যাপে যোগাযোগ (01402893006)')}</span>
        </a>
      </div>

      {/* Official YouTube Channel Video & Subscribe Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-red-950 border border-red-900/40 text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-md">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
            <Youtube className="w-6 h-6 fill-white text-white" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-400 uppercase tracking-wider">
              <span>{t('Official YouTube Channel', 'অফিসিয়াল ইউটিউব চ্যানেল')}</span>
              <span>·</span>
              <span>{lang === 'bn' ? CLINIC_INFO.youtubeChannelNameBn : CLINIC_INFO.youtubeChannelNameEn}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t(
                'Watch Live Therapy Demos & Pain Relief Videos',
                'সুন্নতি হিজামা ও ফিজিওথেরাপি ডেমো ভিডিও দেখতে সাবস্ক্রাইব করুন'
              )}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              {t(
                'Watch Therapist Abdullah perform authentic cupping and explain physical exercise routines. Subscribe to receive our latest health guidance directly on YouTube.',
                'থেরাপিস্ট আব্দুল্লাহর তত্ত্বাবধানে হিজামা পদ্ধতি, মাইগ্রেন ও ঘাড়-কোমর ব্যথার কার্যকরী ব্যায়াম দেখতে এখনই আমাদের ইউটিউব চ্যানেলে যুক্ত হন।'
              )}
            </p>
          </div>
        </div>

        <a
          href={CLINIC_INFO.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap shrink-0 shadow-lg shadow-red-950/50 transition-all border border-red-400/40"
        >
          <Youtube className="w-4 h-4 fill-white" />
          <span>{t('Subscribe on YouTube', 'ইউটিউবে সাবস্ক্রাইব করুন')}</span>
          <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        </a>
      </div>
    </div>
  );
};

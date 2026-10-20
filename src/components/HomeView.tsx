import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_INFO, SERVICES_DATA, PATIENT_REVIEWS, THERAPISTS_DIRECTORY } from '../data/therapyData';
import { ServiceItem, Therapist } from '../types/therapy';
import { TestimonialsView } from './TestimonialsView';
import {
  Phone,
  MessageCircle,
  Calendar,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Home as HomeIcon,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  HeartPulse,
  Youtube,
  Play,
  Bell,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenBookingWithService?: (service: ServiceItem) => void;
  onOpenBookingWithTherapist?: (therapist: Therapist) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenBookingWithService,
  onOpenBookingWithTherapist
}) => {
  const { lang, t } = useLanguage();
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  // Core highlighted therapies requested by user
  const highlightTherapies = SERVICES_DATA.slice(0, 6);

  return (
    <div className="space-y-8 sm:space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={CLINIC_INFO.logo}
                  alt="শরীয়তপুর থেরাপি হাব লোগো"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain shadow-md border-2 border-amber-300 bg-white shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-amber-300 tracking-wider uppercase block">
                    {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
                  </span>
                  <span className="text-xs text-emerald-200">
                    {lang === 'bn' ? CLINIC_INFO.locationBn : CLINIC_INFO.locationEn}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                {t(
                  'Specialized Holistic & Physical Therapy in Shariatpur',
                  'শরীয়তপুরে আধুনিক ফিজিওথেরাপি ও প্রাকৃতিক নিরাময় কেন্দ্র'
                )}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                {t(
                  'Expert clinical Hijama (Cupping), Acupuncture, Acupressure, Physiotherapy, Speech Therapy, and Natural Healthcare under Therapist Abdullah at Town Chikandi Bazar, with dedicated home visit care across Shariatpur.',
                  'থেরাপিস্ট আব্দুল্লাহর তত্ত্বাবধানে সুন্নতি হিজামা, আকুপাংচার, আকুপ্রেশার, আধুনিক ফিজিওথেরাপি ও প্রাকৃতিক চিকিৎসা। টাউন চিকন্দি বাজারে নির্ভরযোগ্য সেবা ও শরীয়তপুরব্যাপী হোম ভিজিট।'
                )}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('book')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('Book an Appointment', 'অ্যাপয়েন্টমেন্ট নিন')}</span>
              </button>

              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                  lang === 'bn'
                    ? 'আসসালামু আলাইকুম, আমি থেরাপিস্ট আব্দুল্লাহর কাছে শরীয়তপুর থেরাপি হাবে সেবা নিতে চাই।'
                    : 'Hello, I want to book an appointment with Therapist Abdullah at Shariatpur Therapy Hub.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 01402893006</span>
              </a>

              <button
                onClick={() => onSelectTab('therapists')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors border border-white/15 flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-300" />
                <span>{t('View Therapists', 'থেরাপিস্টদের পরিচিতি')}</span>
              </button>

              <a
                href={CLINIC_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 border border-red-400/40"
                title="Subscribe to official YouTube channel"
              >
                <Youtube className="w-4 h-4 text-white" />
                <span>{t('YouTube Subscribe', 'ইউটিউব সাবস্ক্রাইব')}</span>
              </a>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Town Chikandi Center', 'চিকন্দি বাজার কেন্দ্র')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Female Specialists for Women', 'মহিলাদের আলাদা ব্যবস্থা')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('Home Care Across 6 Upazilas', 'উপজেলায় হোম সার্ভিস')}</span>
              </div>
            </div>
          </div>

          {/* Image Column: Authentic Consultation Chamber with Therapist Abdullah */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
            <img
              src={CLINIC_INFO.chamberPhoto}
              alt="থেরাপিস্ট আব্দুল্লাহ - শরীয়তপুর থেরাপি হাব চেম্বার"
              className="w-full h-full object-cover object-center lg:absolute lg:inset-0 opacity-95 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950/70 lg:to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/15 text-white flex items-center gap-3">
              <img
                src={CLINIC_INFO.doctorPortrait}
                alt="Therapist Abdullah"
                className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
              />
              <div className="min-w-0">
                <span className="font-bold text-xs block text-amber-300 truncate">
                  {lang === 'bn' ? CLINIC_INFO.leadDoctorNameBn : CLINIC_INFO.leadDoctorNameEn}
                </span>
                <span className="text-[11px] text-slate-300 truncate block">
                  {lang === 'bn' ? CLINIC_INFO.leadDoctorTitleBn : CLINIC_INFO.leadDoctorTitleEn}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Quick Contact Strip */}
      <section className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('Clinic Location in Shariatpur', 'ক্লিনিকের অবস্থান')}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 leading-snug font-medium">
                {lang === 'bn' ? CLINIC_INFO.addressBn : CLINIC_INFO.addressEn}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{t('Google Maps', 'গুগল ম্যাপে দেখুন')}</span>
                </a>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('Directions', 'যাতায়াত গাইড')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('Working Hours', 'রোগী দেখার সময়সূচি')}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">
                {t(CLINIC_INFO.hoursWeekdayEn, CLINIC_INFO.hoursWeekdayBn)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(CLINIC_INFO.hoursFridayEn, CLINIC_INFO.hoursFridayBn)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
            <div className="p-2.5 rounded-lg bg-emerald-700 text-white shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                {t('WhatsApp Booking Hotline', 'হোয়াটসঅ্যাপ হটলাইন')}
              </h2>
              <p className="text-xs text-emerald-900 mt-0.5">
                {t('Instant serial confirmation & queries', 'দ্রুত সিরিয়াল বুকিং ও পরামর্শের জন্য')}
              </p>
              <a
                href={`https://wa.me/${CLINIC_INFO.whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-extrabold text-emerald-800 hover:text-emerald-950 mt-1 inline-block"
              >
                {CLINIC_INFO.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Proof Metrics */}
      <section className="border-y border-slate-200 py-6 sm:py-8 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
              10,000+
            </div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t('Successful Therapy Sessions', 'সফল থেরাপি সেশন')}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
              6
            </div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t('Upazilas Covered for Home Care', 'উপজেলায় সার্বক্ষণিক হোম কেয়ার')}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
              5
            </div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t('Certified Resident Specialists', 'অভিজ্ঞ বিশেষজ্ঞ থেরাপিস্ট')}
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
              100%
            </div>
            <div className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {t('Disposable Sterile Kits Used', 'জীবাণুমুক্ত নিরাপদ সরঞ্জাম')}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Therapies Grid (Hijama, Acupuncture, Acupressure, Physiotherapy, Speech Therapy, Natural Care) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {t('All Core Services Available', 'আমাদের সকল বিশেষায়িত চিকিৎসাসেবা')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('Hijama, Acupuncture, Physiotherapy & Natural Care', 'হিজামা, আকুপাংচার, ফিজিওথেরাপি ও ন্যাচারাল কেয়ার')}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('services')}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{t('View All Therapies & Pricing', 'সব সেবার তালিকা ও ফি')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlightTherapies.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img
                  src={service.image}
                  alt={lang === 'bn' ? service.titleBn : service.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2.5 right-2.5 bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  ৳{service.priceBdt}
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {t(service.duration, service.durationBn)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {lang === 'bn' ? service.titleBn : service.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'bn' ? service.descBn : service.descEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      onOpenBookingWithService ? onOpenBookingWithService(service) : onSelectTab('book')
                    }
                    className="min-h-[38px] w-full text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white transition-colors py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('Book This Therapy', 'বুকিং দিন')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Success Stories & Reviews (Directly Below Main Services) */}
      <TestimonialsView />

      {/* Featured Therapists Spotlight */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {t('Resident Consultants', 'আমাদের বিশেষজ্ঞ চিকিৎসক দল')}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {t('Meet Our Certified Therapists', 'অভিজ্ঞ কনসালট্যান্ট ও থেরাপিস্টবৃন্দ')}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('therapists')}
            className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{t('Search Full Therapist Directory', 'সম্পূর্ণ তালিকা ও বায়ো দেখুন')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {THERAPISTS_DIRECTORY.slice(0, 3).map((therapist) => (
            <div
              key={therapist.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {therapist.image ? (
                    <img
                      src={therapist.image}
                      alt={lang === 'bn' ? therapist.nameBn : therapist.nameEn}
                      className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shadow-sm shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl ${therapist.avatarBg} text-white flex items-center justify-center font-bold text-base shadow-inner shrink-0`}
                    >
                      {therapist.avatarInitial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {lang === 'bn' ? therapist.nameBn : therapist.nameEn}
                    </h3>
                    <p className="text-[11px] font-semibold text-emerald-700">
                      {lang === 'bn' ? therapist.designationBn : therapist.designationEn}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {lang === 'bn' ? therapist.bioBn : therapist.bioEn}
                </div>

                <div className="text-[11px] font-medium text-emerald-900 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold block text-slate-700 text-[10px] uppercase">{t('Specialty', 'বিশেষত্ব')}:</span>
                  <span className="line-clamp-1">{lang === 'bn' ? therapist.specialtyBn : therapist.specialtyEn}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">{t('Fee', 'ফি')}</span>
                  <span className="text-sm font-extrabold text-slate-900">৳{therapist.consultationFeeBdt}</span>
                </div>

                <button
                  onClick={() =>
                    onOpenBookingWithTherapist ? onOpenBookingWithTherapist(therapist) : onSelectTab('book')
                  }
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                >
                  {t('Book Visit', 'সিরিয়াল নিন')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official YouTube Channel & Therapy Video Guide Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-neutral-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-red-900/40 overflow-hidden relative">
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider bg-red-950/80 px-3 py-1 rounded-full border border-red-700/50">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>{t('Official YouTube Channel', 'অফিসিয়াল ইউটিউব চ্যানেল')}</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                {t(
                  'Watch Therapy Demos & Subscribe for Health Tips',
                  'থেরাপির ভিডিও দেখুন এবং স্বাস্থ্য টিপসের জন্য সাবস্ক্রাইব করুন'
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {t(
                  'Watch Therapist Abdullah demonstrate authentic Hijama (cupping) techniques, physical therapy exercises for headache, neck and shoulder pain, and natural wellness guidance. Subscribe to get our newest health videos first!',
                  'থেরাপিস্ট আব্দুল্লাহর পরিচালনায় সুন্নতি হিজামা, ঘাড় ও কাঁধ ব্যথার ঘরোয়া ফিজিওথেরাপি এবং প্রাকৃতিক চিকিৎসার প্র্যাকটিক্যাল ভিডিও দেখতে এখনই আমাদের ইউটিউব চ্যানেলে সাবস্ক্রাইব করুন।'
                )}
              </p>
            </div>

            {/* Prominent Subscribe CTA Button */}
            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <a
                href={CLINIC_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-red-900/50 transition-all border border-red-400/40 hover:scale-[1.02] cursor-pointer"
              >
                <Youtube className="w-5 h-5 text-white fill-white" />
                <span>{t('Subscribe Now (Free)', 'এখনই সাবস্ক্রাইব করুন')}</span>
                <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              </a>
              <span className="text-[11px] text-center text-slate-400">
                {t('Join our channel & stay healthy', 'নিয়মিত ভিডিও পেতে বেল আইকনটি বাজিয়ে রাখুন')}
              </span>
            </div>
          </div>

          {/* Video Player & Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
            {/* Embedded YouTube Player */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-700/70 group">
                <iframe
                  src={`${CLINIC_INFO.youtubeEmbedUrl}?rel=0&modestbranding=1`}
                  title="Shariatpur Therapy Hub - Ash-Shifa Natural Care Official Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-300 px-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>{lang === 'bn' ? CLINIC_INFO.youtubeChannelNameBn : CLINIC_INFO.youtubeChannelNameEn}</span>
                </span>
                <a
                  href={CLINIC_INFO.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 font-bold inline-flex items-center gap-1 hover:underline"
                >
                  <span>{t('Open in YouTube App', 'ইউটিউবে সরাসরি দেখুন')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Channel Features / Why Subscribe Card */}
            <div className="lg:col-span-5 space-y-3.5 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
              <h3 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('What You Will Learn on Our Channel', 'আমাদের ইউটিউব চ্যানেলে যা যা শিখবেন')}</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-red-600/30 text-red-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">{t('Sunnah Hijama & Cupping', 'হিজামা ও কাপিং থেরাপি:')}</strong>
                    <span className="text-slate-300 text-xs leading-relaxed block">
                      {t('Sterile cupping procedures, Sunnah dates, toxic blood release methods & health benefits.', 'জীবাণুমুক্ত কাপিং পদ্ধতি, সুন্নতি তারিখ ও বিষাক্ত টক্সিন মুক্তির নিয়মাবলী।')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-red-600/30 text-red-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">{t('Headache, Neck & Shoulder Pain', 'মাথা, ঘাড় ও কাঁধের ব্যথা:')}</strong>
                    <span className="text-slate-300 text-xs leading-relaxed block">
                      {t('Live physiotherapy demonstrations, gentle stretching, and cervical posture correction.', 'সারভাইকাল স্পন্ডাইলোসিস, ফ্রোজেন শোল্ডার ও মাইগ্রেন নিরাময়ে বিশেষ ব্যায়াম।')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-red-600/30 text-red-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">{t('Acupressure & Natural Care', 'আকুপ্রেশার ও প্রাকৃতিক টিপস:')}</strong>
                    <span className="text-slate-300 text-xs leading-relaxed block">
                      {t('Self-healing pressure points for instant relief without dependency on painkillers.', 'পেইনকিলার ছাড়াই ঘরে বসে আকুপ্রেশার পয়েন্ট চেপে তাৎক্ষণিক ব্যথা কমানোর উপায়।')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <a
                  href={CLINIC_INFO.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  <span>{t('Click Here to Subscribe to Channel', 'ইউটিউব চ্যানেলে সাবস্ক্রাইব করতে ক্লিক করুন')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upazila Home Care Spotlight Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <HomeIcon className="w-4 h-4" />
            <span>{t('Town Chikandi & 6 Shariatpur Upazilas', 'চিকন্দি বাজার ও শরীয়তপুরের ৬টি উপজেলা')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">
            {t(
              'Home Visit Therapy Across All 6 Upazilas of Shariatpur',
              'শরীয়তপুরের প্রতিটি উপজেলায় ঘরে গিয়ে হোম থেরাপি সেবা'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {t(
              'If traveling to Town Chikandi clinic causes pain or if the patient is bedridden or paralyzed, our certified therapist visits with portable electrotherapy units in Sadar, Naria, Damudya, Bhedarganj, Gosairhat, or Zanjira.',
              'ক্লিনিকে যাতায়াত কষ্টকর হলে আমাদের অভিজ্ঞ থেরাপিস্ট পোর্টেবল মেশিন ও প্রয়োজনীয় কিট নিয়ে নড়িয়া, ডামুড্যা, ভেদরগঞ্জ, গোসাইরহাট, জাজিরা ও সদরে আপনার বাসায় পৌঁছে যাবেন।'
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTab('book')}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow cursor-pointer"
            >
              {t('Request Home Visit', 'হোম ভিজিট বুক করুন')}
            </button>
            <a
              href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                'Assalamu Alaikum, I need home therapy service in Shariatpur.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2 rounded-xl border border-white/30 text-white font-medium text-xs sm:text-sm hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 01402893006</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_INFO, FAQS } from '../data/therapyData';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Navigation,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Youtube
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={CLINIC_INFO.logo}
              alt="শরীয়তপুর থেরাপি হাব লোগো"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain shadow-md border-2 border-amber-300 bg-white shrink-0"
            />
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
              </span>
              <span className="text-xs text-emerald-200">
                {lang === 'bn' ? CLINIC_INFO.locationBn : CLINIC_INFO.locationEn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-emerald-950/60 border border-emerald-500/30 p-2 sm:px-3 sm:py-2 rounded-xl self-start sm:self-auto">
            <img
              src={CLINIC_INFO.doctorPortrait}
              alt="Therapist Abdullah"
              className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
            />
            <div>
              <span className="text-xs font-bold text-white block">
                {lang === 'bn' ? CLINIC_INFO.leadDoctorNameBn : CLINIC_INFO.leadDoctorNameEn}
              </span>
              <span className="text-[10px] text-emerald-300 block">
                {lang === 'bn' ? CLINIC_INFO.leadDoctorTitleBn : CLINIC_INFO.leadDoctorTitleEn}
              </span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>{t('Town Chikandi Bazar · Shariatpur, Bangladesh', 'টাউন চিকন্দি বাজার (আইসক্রিম ফ্যাক্টরির পাশে) · শরীয়তপুর সদর')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ textWrap: 'balance' }}>
          {t('Visit Shariatpur Therapy Hub', 'আমাদের অবস্থান ও সরাসরি যোগাযোগ')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
          {t(
            'Conveniently situated at Town Chikandi Bazar (Beside Ice Cream Factory) in Shariatpur Sadar. Easily accessible by autorickshaw, bus, and private transport from across all upazilas.',
            'শরীয়তপুর সদর উপজেলার ঐতিহ্যবাহী টাউন চিকন্দি বাজার আইসক্রিম ফ্যাক্টরির পাশে আমাদের কেন্দ্রটি অবস্থিত। নড়িয়া, ডামুড্যা, ভেদরগঞ্জ ও সদর থেকে যেকোনো যানবাহনে সহজে আসা যায়।'
          )}
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WhatsApp Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-900 uppercase block">
              {t('Official WhatsApp', 'অফিশিয়াল হোয়াটসঅ্যাপ')}
            </span>
            <div className="text-lg font-extrabold text-emerald-950">
              01402893006
            </div>
            <p className="text-xs text-emerald-800">
              {t('Direct consultation, serial booking & instant inquiries', 'তাৎক্ষণিক সিরিয়াল, পরামর্শ ও রিপোর্ট প্রেরণের জন্য')}
            </p>
          </div>
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
              lang === 'bn'
                ? 'আসসালামু আলাইকুম, আমি শরীয়তপুর থেরাপি হাবে থেরাপির বিষয়ে বিস্তারিত জানতে চাই।'
                : 'Hello Shariatpur Therapy Hub, I would like to inquire about treatments.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-2"
          >
            <span>{t('Chat on WhatsApp', 'মেসেজ দিন')}</span>
            <span>→</span>
          </a>
        </div>

        {/* Phone Call Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {t('Direct Call Hotline', 'সরাসরি ফোন হটলাইন')}
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              01402893006
            </div>
            <p className="text-xs text-slate-600">
              {t('Reach our reception during clinic hours for instant voice booking', 'সরাসরি ডাক্তারের সাথে কথা বলে সিরিয়াল নিশ্চিত করুন')}
            </p>
          </div>
          <a
            href={`tel:${CLINIC_INFO.whatsappClean}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 pt-2"
          >
            <span>{t('Call Now', 'সরাসরি কল দিন')}</span>
            <span>→</span>
          </a>
        </div>

        {/* YouTube Channel & Video Hub Card */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Youtube className="w-5 h-5 fill-white" />
            </div>
            <span className="text-[11px] font-bold text-red-900 uppercase block">
              {t('Official YouTube Channel', 'অফিশিয়াল ইউটিউব চ্যানেল')}
            </span>
            <div className="text-base font-extrabold text-slate-900 line-clamp-1">
              {lang === 'bn' ? 'আশ-শিফা ন্যাচারাল কেয়ার' : 'Ash-Shifa Natural Care'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Watch Hijama therapy demos, neck & back pain exercises & health tips. Subscribe to stay updated.',
                'হিজামা ডেমো, ঘাড় ও কোমর ব্যথার ব্যায়াম এবং স্বাস্থ্য পরামর্শ দেখতে আমাদের চ্যানেলে সাবস্ক্রাইব করুন।'
              )}
            </p>
          </div>
          <a
            href={CLINIC_INFO.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-2"
          >
            <span>{t('Subscribe on YouTube', 'ইউটিউবে সাবস্ক্রাইব করুন')}</span>
            <span>→</span>
          </a>
        </div>

        {/* Hours & Email Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              {t('Clinic Hours', 'রোগী দেখার সময়সূচি')}
            </span>
            <p className="text-xs font-bold text-slate-900">
              {t(CLINIC_INFO.hoursWeekdayEn, CLINIC_INFO.hoursWeekdayBn)}
            </p>
            <p className="text-xs text-slate-600">
              {t(CLINIC_INFO.hoursFridayEn, CLINIC_INFO.hoursFridayBn)}
            </p>
            <div className="pt-1 text-[11px] text-slate-500 truncate">
              <span>{CLINIC_INFO.email}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {lang === 'bn' ? 'শুক্রবার জুম্মার পর খোলা' : 'Friday opens after Jummah'}
          </span>
        </div>
      </div>

      {/* Location & Directions Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                {t('Physical Address', 'আমাদের সঠিক ঠিকানা')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {lang === 'bn' ? CLINIC_INFO.locationBn : CLINIC_INFO.locationEn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {lang === 'bn' ? CLINIC_INFO.addressBn : CLINIC_INFO.addressEn}
              </p>
            </div>

            <a
              href={CLINIC_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('Open in Google Maps', 'গুগল ম্যাপে দেখুন')}</span>
            </a>
          </div>

          {/* Directions Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-slate-800 block">
                {t('From Shariatpur Sadar Bus Stand', 'শরীয়তপুর সদর বাসস্ট্যান্ড থেকে')}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'Take an auto-rickshaw or easy-bike heading towards Chikandi. Distance is ~6-8 km (15-20 minutes). Drop off at Town Chikandi Bazar center (Beside Ice Cream Factory).',
                  'সদর থেকে যেকোনো ইজিবাইক বা অটোরিকশায় চিকন্দিগামী গাড়িতে উঠুন। প্রায় ১৫-২০ মিনিটের দূরত্ব। টাউন চিকন্দি বাজার আইসক্রিম ফ্যাক্টরির পাশে ক্লিনিক।'
                )}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-slate-800 block">
                {t('From Naria & Damudya Upazilas', 'নড়িয়া ও ডামুড্যা উপজেলা থেকে')}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'Connected via direct paved upazila roads. Accessible by CNG or local bus directly to Chikandi Bazar.',
                  'নড়িয়া বা ডামুড্যা থেকে সরাসরি সিএনজি ও লোকাল যাতায়াত ব্যবস্থা রয়েছে চিকন্দি বাজার পর্যন্ত।'
                )}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-slate-800 block">
                {t('From Dhaka & Padma Bridge', 'ঢাকা ও পদ্মা সেতু হয়ে আগমন')}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t(
                  'Cross Padma Bridge to Naodoba / Zanjira, proceed to Shariatpur Sadar, and head to Town Chikandi Bazar.',
                  'পদ্মা সেতু হয়ে জাজিরা দিয়ে শরীয়তপুর সদর প্রবেশ করে টাউন চিকন্দি বাজারে পৌঁছাতে পারেন।'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Map Preview Graphic */}
        <div className="bg-slate-100 p-6 sm:p-8 border-t border-slate-200 text-center space-y-3">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Navigation className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {t('Official Google Maps Location', 'অফিশিয়াল গুগল ম্যাপ লোকেশন')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t(
                'Turn-by-turn navigation directly to Shariatpur Therapy Hub at Town Chikandi Bazar on your smartphone.',
                'আপনার স্মার্টফোনে সরাসরি রুট ও দিকনির্দেশনা দেখতে নিচের বোতামে চাপ দিন।'
              )}
            </p>
            <a
              href={CLINIC_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4 text-emerald-200" />
              <span>{t('Open Google Maps Navigation (Turn-by-Turn)', 'গুগল ম্যাপে সরাসরি লোকেশন দেখুন')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Shariatpur Upazilas We Serve */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {t('Coverage Areas Across Shariatpur District', 'শরীয়তপুর জেলাব্যাপী আমাদের সেবা অঞ্চলসমূহ')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CLINIC_INFO.upazilas.map((u) => (
            <div
              key={u.en}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">{lang === 'bn' ? u.bn : u.en}</span>
                <span className="text-[10px] text-slate-500">{t('Clinic & Home Visit', 'ক্লিনিক ও হোম কেয়ার')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {t('Frequently Asked Questions (FAQ)', 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Common queries regarding treatment, doctors, and fees', 'থেরাপির নিয়মাবলী, খরচ ও সেবা সংক্রান্ত তথ্য')}
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? faq.qBn : faq.qEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {lang === 'bn' ? faq.aBn : faq.aEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

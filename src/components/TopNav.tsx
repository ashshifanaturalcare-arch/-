import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CLINIC_INFO } from '../data/therapyData';
import { Calendar, Phone, Lock, MessageCircle, MapPin, Youtube } from 'lucide-react';

interface TopNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenBooking: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentTab, onSelectTab, onOpenBooking }) => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single brand wordmark with circular official logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left font-bold tracking-tight text-slate-900 text-base sm:text-lg whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <img
            src={CLINIC_INFO.logo}
            alt="শরীয়তপুর থেরাপি হাব লোগো"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain shrink-0 shadow-xs border border-amber-300 bg-white"
          />
          <span className="leading-tight">
            {lang === 'bn' ? CLINIC_INFO.nameBn : CLINIC_INFO.nameEn}
          </span>
        </button>

        {/* Zone 2: 5 clean single-line nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'home' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('Home', 'হোম')}
          </button>
          <button
            onClick={() => onSelectTab('services')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'services' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('Therapies', 'থেরাপিসমূহ')}
          </button>
          <button
            onClick={() => onSelectTab('therapists')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'therapists' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('Therapists', 'থেরাপিস্ট তালিকা')}
          </button>
          <button
            onClick={() => onSelectTab('checker')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'checker' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('Symptom Check', 'ব্যথা পরীক্ষা')}
          </button>
          <button
            onClick={() => onSelectTab('appointments')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'appointments' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('My Visits', 'আমার সিরিয়াল')}
          </button>
          <button
            onClick={() => onSelectTab('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentTab === 'contact' ? 'text-emerald-700 font-semibold' : 'hover:text-slate-900'
            }`}
          >
            {t('Location & Contact', 'ঠিকানা ও যোগাযোগ')}
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Direct YouTube Channel & Subscribe Shortcut */}
          <a
            href={CLINIC_INFO.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors shadow-2xs"
            title={lang === 'bn' ? 'ইউটিউব চ্যানেলে সাবস্ক্রাইব করুন' : 'Subscribe to our YouTube Channel'}
            aria-label="Subscribe to YouTube"
          >
            <Youtube className="w-4 h-4 text-red-600 shrink-0" />
            <span className="hidden sm:inline font-bold">{t('Subscribe', 'সাবস্ক্রাইব')}</span>
          </a>

          {/* Direct Google Maps Shortcut */}
          <a
            href={CLINIC_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            title="Google Maps Location"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('Maps', 'ম্যাপ')}</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="min-h-[38px] px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Switch Language / ভাষা পরিবর্তন"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'বাংলা' : 'English'}
          </button>

          {/* Admin Dashboard trigger */}
          <button
            onClick={() => onSelectTab('admin')}
            className={`min-h-[38px] min-w-[38px] p-2 rounded-lg border transition-colors flex items-center justify-center cursor-pointer ${
              currentTab === 'admin'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Reception & Admin Portal (PIN: 1234)"
            aria-label="Admin Portal"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action: Book Button */}
          <button
            onClick={onOpenBooking}
            className="min-h-[38px] px-3.5 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('Book Appointment', 'বুকিং দিন')}</span>
            <span className="sm:hidden">{t('Book', 'বুকিং')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

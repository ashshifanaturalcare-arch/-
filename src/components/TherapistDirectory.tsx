import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { THERAPISTS_DIRECTORY, CLINIC_INFO } from '../data/therapyData';
import { Therapist } from '../types/therapy';
import {
  Search,
  Filter,
  Calendar,
  MessageCircle,
  Star,
  Award,
  Clock,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';

interface TherapistDirectoryProps {
  onBookTherapist: (therapist: Therapist) => void;
}

export const TherapistDirectory: React.FC<TherapistDirectoryProps> = ({ onBookTherapist }) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [expandedBioId, setExpandedBioId] = useState<string | null>(null);

  const specialtiesList = [
    { id: 'all', en: 'All Specialties', bn: 'সকল বিভাগ' },
    { id: 'physio', en: 'Physiotherapy', bn: 'ফিজিওথেরাপি' },
    { id: 'hijama', en: 'Hijama & Cupping', bn: 'হিজামা ও কাপিং' },
    { id: 'acupuncture', en: 'Acupuncture', bn: 'আকুপাংচার' },
    { id: 'acupressure', en: 'Acupressure', bn: 'আকুপ্রেশার' },
    { id: 'speech', en: 'Speech Therapy', bn: 'স্পিচ থেরাপি' },
    { id: 'natural', en: 'Natural Healthcare', bn: 'ন্যাচারাল কেয়ার' },
    { id: 'home', en: 'Home Visits', bn: 'হোম ভিজিট' }
  ];

  const filteredTherapists = useMemo(() => {
    return THERAPISTS_DIRECTORY.filter((item) => {
      // Specialty filter
      if (selectedSpecialty !== 'all' && !item.specialties.includes(selectedSpecialty)) {
        return false;
      }
      // Gender filter
      if (genderFilter !== 'all' && item.gender !== genderFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          item.nameEn.toLowerCase().includes(q) || item.nameBn.includes(q);
        const matchesQualification =
          item.qualificationEn.toLowerCase().includes(q) ||
          item.qualificationBn.includes(q);
        const matchesSpecialty =
          item.specialtyEn.toLowerCase().includes(q) ||
          item.specialtyBn.includes(q);
        const matchesBio =
          item.bioEn.toLowerCase().includes(q) || item.bioBn.includes(q);

        return matchesName || matchesQualification || matchesSpecialty || matchesBio;
      }
      return true;
    });
  }, [searchQuery, selectedSpecialty, genderFilter]);

  const toggleBio = (id: string) => {
    setExpandedBioId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Directory Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>{t('Certified Practitioners & Consultants', 'সার্টিফাইড বিশেষজ্ঞ থেরাপিস্টদের তালিকা')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ textWrap: 'balance' }}>
            {t(
              'Meet Our Specialist Therapists in Shariatpur',
              'শরীয়তপুর থেরাপি হাবের অভিজ্ঞ কনসালট্যান্ট ও থেরাপিস্টবৃন্দ'
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {t(
              'Our team includes university-certified physiotherapists, licensed Hijama & natural care practitioners, acupuncturists, and speech therapists practicing at Town Chikandi Bazar and offering home visits.',
              'ঢাকা বিশ্ববিদ্যালয় ও বিভিন্ন নামীদামী প্রতিষ্ঠান থেকে ডিগ্রিপ্রাপ্ত অভিজ্ঞ ফিজিওথেরাপিস্ট, সুন্নতি হিজামা বিশেষজ্ঞ, আকুপাংচারিস্ট এবং স্পিচ থেরাপিস্টবৃন্দ।'
            )}
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(
              'Search therapist by name, qualification, or specialty (e.g., Tariqul, Hijama, Speech, Stroke)...',
              'থেরাপিস্টের নাম, ডিগ্রি বা বিশেষত্ব দিয়ে খুঁজুন (যেমন: হিজামা, আকুপাংচার, স্পিচ, স্ট্রোক)...'
            )}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              {t('Clear', 'মুছুন')}
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                genderFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('All Therapists', 'সবাই')}
            </button>
            <button
              onClick={() => setGenderFilter('female')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                genderFilter === 'female'
                  ? 'bg-white text-emerald-800 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Female Specialist (মহিলা)', 'মহিলা থেরাপিস্ট')}
            </button>
            <button
              onClick={() => setGenderFilter('male')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                genderFilter === 'male'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Male Specialist (পুরুষ)', 'পুরুষ থেরাপিস্ট')}
            </button>
          </div>

          {/* Result Count */}
          <div className="text-xs text-slate-500">
            {t(
              `Showing ${filteredTherapists.length} available specialist(s)`,
              `মোট ${filteredTherapists.length} জন বিশেষজ্ঞ থেরাপিস্ট পাওয়া গেছে`
            )}
          </div>
        </div>

        {/* Specialty Filter Scrollable Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1">
          {specialtiesList.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedSpecialty(spec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedSpecialty === spec.id
                  ? 'bg-emerald-700 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(spec.en, spec.bn)}
            </button>
          ))}
        </div>
      </div>

      {/* Therapist Profiles Grid */}
      {filteredTherapists.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {t('No therapist found matching your criteria', 'আপনার অনুসন্ধানের সাথে কোনো থেরাপিস্ট মেলেনি')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t(
              'Try adjusting your search terms or specialty filters to see all available practitioners.',
              'অনুসন্ধান শব্দ পরিবর্তন করে বা অন্য ফিল্টার নির্বাচন করে পুনরায় চেষ্টা করুন।'
            )}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
              setGenderFilter('all');
            }}
            className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            {t('Reset All Filters', 'সব ফিল্টার রিসেট করুন')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredTherapists.map((therapist) => {
            const isBioExpanded = expandedBioId === therapist.id;

            return (
              <div
                key={therapist.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Profile Card Header */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar / Photo */}
                    {therapist.image ? (
                      <img
                        src={therapist.image}
                        alt={lang === 'bn' ? therapist.nameBn : therapist.nameEn}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-sm border-2 border-emerald-300 shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${therapist.avatarBg} text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-inner shrink-0`}
                      >
                        {therapist.avatarInitial}
                      </div>
                    )}

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                          {lang === 'bn' ? therapist.nameBn : therapist.nameEn}
                        </h2>
                        {therapist.isLeadSpecialist && (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                            {t('Founder & Chief', 'প্রতিষ্ঠাতা ও প্রধান')}
                          </span>
                        )}
                        {therapist.gender === 'female' && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            {t('Female Specialist', 'মহিলা বিশেষজ্ঞ')}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                        {lang === 'bn' ? therapist.designationBn : therapist.designationEn}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{therapist.rating}</span>
                          <span className="text-slate-400 font-normal">({therapist.reviewsCount})</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <span>
                          {t(`${therapist.experienceYears}+ Yrs Exp`, `${therapist.experienceYears}+ বছরের অভিজ্ঞতা`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Qualifications & Degrees */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">
                      {t('Degree & Certifications:', 'ডিগ্রি ও প্রশিক্ষণসমূহ:')}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {lang === 'bn' ? therapist.qualificationBn : therapist.qualificationEn}
                    </p>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-slate-700 block">
                      {t('Key Specializations:', 'বিশেষ পারদর্শিতা:')}
                    </span>
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      {lang === 'bn' ? therapist.specialtyBn : therapist.specialtyEn}
                    </p>
                  </div>

                  {/* Brief Bio */}
                  <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    <p className={isBioExpanded ? '' : 'line-clamp-2'}>
                      {lang === 'bn' ? therapist.bioBn : therapist.bioEn}
                    </p>
                    <button
                      onClick={() => toggleBio(therapist.id)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 mt-1 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isBioExpanded ? t('Show Less', 'সংক্ষেপ করুন') : t('Read Full Bio', 'বিস্তারিত পরিচিতি পড়ুন')}</span>
                      {isBioExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Availability & Location */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">
                        {lang === 'bn' ? therapist.availableDaysBn : therapist.availableDaysEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        {therapist.consultationType === 'both'
                          ? t('Town Chikandi Center & Upazila Home Care', 'টাউন চিকন্দি ক্লিনিক ও হোম ভিজিট')
                          : t('Town Chikandi Bazar Clinic', 'টাউন চিকন্দি বাজার কেন্দ্র')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom Strip */}
                <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      {t('Consultation Fee', 'পরামর্শ ফি')}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ৳{therapist.consultationFeeBdt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* WhatsApp Direct Inquire */}
                    <a
                      href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                        lang === 'bn'
                          ? `আসসালামু আলাইকুম, আমি ${therapist.nameBn}-এর অ্যাপয়েন্টমেন্টের বিষয়ে জানতে চাই।`
                          : `Hello, I would like to inquire about booking an appointment with ${therapist.nameEn} at Shariatpur Therapy Hub.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[40px] px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="WhatsApp Doctor Inquire"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Book Button */}
                    <button
                      onClick={() => onBookTherapist(therapist)}
                      className="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('Book Session', 'বুকিং দিন')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

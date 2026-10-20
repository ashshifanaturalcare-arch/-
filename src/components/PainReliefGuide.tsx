import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PAIN_TREATMENT_CONDITIONS, CLINIC_INFO, SERVICES_DATA } from '../data/therapyData';
import { PainTherapyCondition } from '../types/therapy';
import {
  Activity,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  Award
} from 'lucide-react';

interface PainReliefGuideProps {
  onSelectTab: (tab: string) => void;
  onOpenBookingWithService?: (serviceId: string) => void;
  onOpenShopWithProduct?: (productId: string) => void;
}

export const PainReliefGuide: React.FC<PainReliefGuideProps> = ({
  onSelectTab,
  onOpenBookingWithService,
  onOpenShopWithProduct
}) => {
  const { lang, t } = useLanguage();
  const [selectedConditionId, setSelectedConditionId] = useState<string>(
    PAIN_TREATMENT_CONDITIONS[0].id
  );
  const [activeGenderView, setActiveGenderView] = useState<'both' | 'male' | 'female'>('both');

  const currentCondition =
    PAIN_TREATMENT_CONDITIONS.find((c) => c.id === selectedConditionId) ||
    PAIN_TREATMENT_CONDITIONS[0];

  return (
    <div className="space-y-8 sm:space-y-10 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider bg-emerald-900/60 px-3 py-1 rounded-full border border-amber-300/30">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('Specialized Clinical Pain Relief Guide', 'মাথাব্যথা, ঘাড় ও কাঁধ ব্যথার বিশেষায়িত চিকিৎসা গাইড')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t(
              'Evidence-Based Natural Therapies for Head, Neck & Shoulder Pain',
              'মাথাব্যথা, ঘাড় ব্যথা ও কাঁধের ব্যথায় কার্যকরী সুন্নতি ও আধুনিক থেরাপিসমূহ'
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {t(
              'Comprehensive physical therapy, Sunnah Hijama, precision acupuncture, and acupressure protocols under certified supervision at Town Chikandi Bazar, Shariatpur Sadar.',
              'বছরের পর বছর পেইনকিলার না খেয়ে হিজামা, আকুপাংচার ও আধুনিক ফিজিওথেরাপির মাধ্যমে ব্যথার মূল উৎস নির্মূল করুন। পুরুষ ও মহিলা রোগীদের জন্য পৃথক বিশেষজ্ঞ থেরাপিস্ট দ্বারা পরিচালিত।'
            )}
          </p>
        </div>
      </div>

      {/* Visual Clinical Showcase: Men & Women Hijama & Therapy Photos */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              {t('Clinical Photo Gallery', 'প্রফেশনাল থেরাপি ফটো গ্যালারি')}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              {t('Hijama, Acupuncture & Acupressure in Practice', 'হিজামা (পুরুষ ও মহিলা), আকুপাংচার ও আকুপ্রেশার থেরাপি')}
            </h2>
          </div>

          {/* Gender Filter Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveGenderView('both')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeGenderView === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('All Sessions', 'সকল থেরাপি')}
            </button>
            <button
              onClick={() => setActiveGenderView('male')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeGenderView === 'male' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Hijama (Male)', 'হিজামা (পুরুষ)')}
            </button>
            <button
              onClick={() => setActiveGenderView('female')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeGenderView === 'female' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('Hijama (Female)', 'হিজামা (মহিলা)')}
            </button>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Hijama Male */}
          {(activeGenderView === 'both' || activeGenderView === 'male') && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/hijama_therapy_man_1792462079847.jpg"
                  alt="পুরুষ রোগীর সুন্নতি হিজামা ও কাপিং থেরাপি"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-emerald-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('Male Treatment Room', 'পুরুষ রোগীদের থেরাপি')}
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {t('Hijama / Cupping for Men', 'পুরুষ রোগীদের নিরাপদ সুন্নতি হিজামা')}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t(
                    'Certified male therapist performing sterile cupping on back and neck for back pain, migraines, and detoxification.',
                    'পিঠ, কোমর ও ঘাড়ের পুরনো টক্সিনযুক্ত রক্ত বের করে ব্যথামুক্ত জীবনের জন্য ১০০% জীবাণুমুক্ত ওয়ান-টাইম কিট।'
                  )}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>{t('Sterile One-Time Kit', 'জীবাণুমুক্ত ওয়ান-টাইম কিট')}</span>
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-bold">৳৭০০</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Hijama Female */}
          {(activeGenderView === 'both' || activeGenderView === 'female') && (
            <div className="rounded-2xl border border-teal-200 overflow-hidden bg-teal-50/50 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden bg-teal-100">
                <img
                  src="/src/assets/images/hijama_therapy_woman_1792462080617.jpg"
                  alt="মহিলা রোগীর হিজামা ও প্রাইভেট কেয়ার"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-teal-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('Female Specialist & Privacy', 'মহিলা বিশেষজ্ঞ ও পূর্ণ পর্দা')}
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-teal-950">
                  {t('Hijama for Women by Female Doctor', 'মহিলাদের জন্য অভিজ্ঞ নারী চিকিৎসকের তত্ত্বাবধান')}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t(
                    'Strict privacy and gentle care by female therapist for migraines, hormonal imbalances, neck tension, and back pain.',
                    'সম্পূর্ণ ব্যক্তিগত ও নিরাপদ পরিবেশে মাইগ্রেন, ঘাড়-কোমরের ব্যথা ও হরমোনাল ভারসাম্যহীনতায় অভিজ্ঞ নারী থেরাপিস্ট।'
                  )}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-teal-800">
                  <span>{t('100% Female Privacy Guaranteed', 'পূর্ণ পর্দা ও নিরাপদ পরিবেশ')}</span>
                  <span className="text-teal-900 bg-white border border-teal-200 px-2 py-0.5 rounded-md font-bold">৳৭০০</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: Acupuncture Head & Neck */}
          {activeGenderView === 'both' && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/acupuncture_head_neck_1792462080469.jpg"
                  alt="আকুপাংচার থেরাপি মাথাব্যথা ও ঘাড়ের জন্য"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('Headache & Neck Acupuncture', 'মাথা ও ঘাড়ের আকুপাংচার')}
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {t('Clinical Acupuncture Therapy', 'ক্লিনিক্যাল আকুপাংচার থেরাপি')}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t(
                    'Precision meridian micro-needling releasing cervical nerve compression, migraines, and facial nerve stiffness.',
                    'সূক্ষ্ম জীবাণুমুক্ত নিডল দ্বারা নার্ভ ও রক্তনালীর চাপ মুক্ত করে ব্যথানাশক প্রাকৃতিক হরমোন উদ্দীপন।'
                  )}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>{t('Single-Use Ultra-Fine Needles', 'এককালীন ওয়ান-টাইম সুঁই')}</span>
                  <span className="text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">৳৮০০</span>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: Acupressure Shoulder & Neck */}
          {activeGenderView === 'both' && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
              <div className="h-48 relative overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/acupressure_pain_relief_1792462082689.jpg"
                  alt="আকুপ্রেশার ও শোল্ডার ট্রিগার পয়েন্ট রিলিজ"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {t('Shoulder Trigger Point Relief', 'কাঁধ ও ঘাড়ের ট্রিগার পয়েন্ট')}
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  {t('Acupressure & Trigger Point Release', 'আকুপ্রেশার ও ফ্রোজেন শোল্ডার থেরাপি')}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {t(
                    'Manual thumb and palm pressure dissolving deep shoulder knots, frozen shoulder stiffness, and tension headaches.',
                    'হাতের তালু ও আঙুলের সঠিক চাপে কাঁধের জমাট বাঁধা ট্রিগার পয়েন্ট মুক্ত করে হাত সহজে নাড়ানোর উপযোগী করা।'
                  )}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>{t('Needle-Free Natural Care', 'সুঁই ছাড়া প্রাকৃতিক থেরাপি')}</span>
                  <span className="text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">৳৬০০</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Tabs for Specific Conditions: Headache, Neck Pain, Shoulder Pain */}
      <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Condition Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-slate-200 bg-slate-50">
          {PAIN_TREATMENT_CONDITIONS.map((cond) => {
            const isSelected = selectedConditionId === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setSelectedConditionId(cond.id)}
                className={`p-4 sm:p-5 text-left transition-all cursor-pointer border-b-2 sm:border-b-0 sm:border-r last:border-r-0 ${
                  isSelected
                    ? 'bg-white border-emerald-700 shadow-xs'
                    : 'border-transparent hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span className="block text-[11px] font-bold uppercase text-emerald-800">
                  {cond.id === 'headache-migraine' && '১. মাথাব্যথা ও মাইগ্রেন'}
                  {cond.id === 'neck-cervical-pain' && '২. ঘাড় ব্যথা ও ক্ষয়'}
                  {cond.id === 'shoulder-frozen-pain' && '৩. কাঁধ ও ফ্রোজেন শোল্ডার'}
                </span>
                <span className="block text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  {lang === 'bn' ? cond.titleBn.split(' ')[0] + ' ও ' + cond.titleBn.split(' ')[1] : cond.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Condition Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Headline & Clinical Image Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase block">
                {t('Clinical Protocol at Town Chikandi', 'টাউন চিকন্দি ক্লিনিক্যাল প্রোটোকল')}
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {lang === 'bn' ? currentCondition.titleBn : currentCondition.titleEn}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {currentCondition.subtitleBn}
              </p>

              {/* Quick WhatsApp Inquiry for this pain */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onSelectTab('book')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('Book Treatment for This Pain', 'এই সমস্যার জন্য অ্যাপয়েন্টমেন্ট নিন')}</span>
                </button>

                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম, আমি শরীয়তপুর থেরাপি হাবে '${currentCondition.titleBn}' সম্পর্কে পরামর্শ ও চিকিৎসা নিতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>{t('Doctor WhatsApp (01402893006)', 'ডাক্তারের হোয়াটসঅ্যাপে পরামর্শ')}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <img
                src={currentCondition.image}
                alt={currentCondition.titleBn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                  {lang === 'bn' ? currentCondition.titleBn : currentCondition.titleEn}
                </span>
              </div>
            </div>
          </div>

          {/* Causes & Symptoms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Causes */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{t('Common Causes & Triggers', 'প্রধান কারণ ও ঝুঁকি')}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentCondition.commonCausesBn.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Symptoms */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{t('Key Symptoms', 'লক্ষণ ও শারীরিক কষ্ট')}</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {currentCondition.symptomsBn.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Effective Therapy Methods Table / Cards */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900">
              {t('Effective Holistic Therapies at Our Hub', 'শরীয়তপুর থেরাপি হাবে কার্যকরী চিকিৎসা পদ্ধতিসমূহ')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCondition.effectiveTherapies.map((eff, i) => (
                <div
                  key={i}
                  className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100 flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/70 inline-block px-2 py-0.5 rounded-md">
                      {eff.durationBn}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {eff.therapyNameBn}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {eff.howItHelpsBn}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenBookingWithService) {
                        onOpenBookingWithService(eff.serviceId);
                      } else {
                        onSelectTab('book');
                      }
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-2 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('Book This Therapy', 'সিরিয়াল নিন')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Specialist Expert Advice Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 sm:p-6 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={CLINIC_INFO.doctorPortrait}
              alt="Therapist Abdullah"
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shrink-0 shadow-sm"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  {lang === 'bn' ? CLINIC_INFO.leadDoctorNameBn : CLINIC_INFO.leadDoctorNameEn}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {t('Specialist Recommendation', 'বিশেষজ্ঞ চিকিৎসকের পরামর্শ')}
                </span>
              </div>
              <p className="leading-relaxed text-slate-700">
                {currentCondition.therapistAdviceBn}
              </p>
            </div>
          </div>

          {/* Recommended Healthcare Products for this Pain */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {t('Need Home Support Products for this Condition?', 'ঘরে ব্যবহারের জন্য প্রয়োজনীয় বেল্ট বা ভেষজ তেল প্রয়োজন?')}
                </span>
                <span className="text-xs text-slate-600 block">
                  {t('Visit our online healthcare shop to order original products directly.', 'আমাদের অনলাইন শপ থেকে অরিজিনাল হিজামা কিট, সারভাইকাল কলার ও মালিশ তেল অর্ডার করুন।')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('shop')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t('Go to Online Shop', 'অনলাইন শপ দেখুন')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES_DATA, CLINIC_INFO } from '../data/therapyData';
import { ServiceItem } from '../types/therapy';
import {
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Activity,
  HeartPulse,
  Brain,
  Baby,
  Smile,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface SymptomCheckerProps {
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onSelectServiceForBooking }) => {
  const { lang, t } = useLanguage();

  const [selectedCondition, setSelectedCondition] = useState<string>('back-pain');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [duration, setDuration] = useState<string>('weeks');

  const conditions = [
    {
      id: 'back-pain',
      titleEn: 'Lower Back, Neck & Sciatica Pain',
      titleBn: 'কোমর, ঘাড় ও সায়াটিকার তীব্র ব্যথা',
      icon: Activity,
      recommendedServiceId: 'physiotherapy',
      adviceEn: [
        'Avoid lifting heavy loads or bending forward abruptly.',
        'Use a firm orthopedic sleeping surface and maintain upright sitting posture.',
        'Immediate spinal decompression, traction, and physical therapy are indicated.'
      ],
      adviceBn: [
        'ভারী বস্তু তোলা বা হঠাৎ সামনের দিকে ঝুঁকে কাজ করা বন্ধ রাখুন।',
        'শোয়ার সময় শক্ত তোষক বা সমতল বিছানা ব্যবহার করুন।',
        'মেরুদণ্ডের ডিস্কের চাপ কমাতে আধুনিক ট্র্যাকশন ও ফিজিওথেরাপি শুরু করুন।'
      ]
    },
    {
      id: 'migraine-toxin',
      titleEn: 'Chronic Migraine, Lethargy & Blood Toxins',
      titleBn: 'পুরনো মাইগ্রেন, শরীর ব্যথা ও ক্লান্তি',
      icon: HeartPulse,
      recommendedServiceId: 'hijama-cupping',
      adviceEn: [
        'Clinical wet cupping (Hijama) removes stagnant capillary blood and relieves pressure.',
        'Maintain hydration and avoid skipping meals or excessive sunlight exposure.',
        'Use only disposable, single-use sterile cups under certified practitioners.'
      ],
      adviceBn: [
        'সুন্নতি হিজামা ক্ষতিকর বিষাক্ত রক্ত বের করে মাথায় ও কাঁধের রক্ত সঞ্চালন স্বাভাবিক করে।',
        'প্রচুর বিশুদ্ধ পানি পান করুন এবং অনিয়মিত ঘুমের অভ্যাস ত্যাগ করুন।',
        'চিকন্দি বাজার হাবে অভিজ্ঞ থেরাপিস্ট দ্বারা জীবাণুমুক্ত ওয়ান-টাইম কিট দিয়ে হিজামা নিন।'
      ]
    },
    {
      id: 'facial-nerve',
      titleEn: 'Facial Paralysis (Bell\'s Palsy) & Nerve Pain',
      titleBn: 'মুখ বাঁকা হওয়া (বেলস্ পালসি) ও স্নায়ুর ব্যথা',
      icon: Smile,
      recommendedServiceId: 'acupuncture',
      adviceEn: [
        'Micro-needling acupuncture directly stimulates paralyzed facial muscles and dormant nerves.',
        'Protect the affected eye from dust and direct cold wind.',
        'Early acupuncture intervention within 1-3 weeks yields the highest recovery rate.'
      ],
      adviceBn: [
        'আকুপাংচার স্নায়ুর রিসেপ্টর উদ্দীপিত করে মুখের মাংসপেশির স্বাভাবিক চলাচল দ্রুত ফিরিয়ে আনে।',
        'বাতাস ও ধুলাবালি থেকে আক্রান্ত চোখ রক্ষা করতে চশমা ব্যবহার করুন।',
        'বিলম্ব না করে দ্রুত আকুপাংচার শুরু করলে নিরাময়ের সম্ভাবনা শতভাগ বেড়ে যায়।'
      ]
    },
    {
      id: 'stress-spasm',
      titleEn: 'Muscular Spasms, Stress & Insomnia',
      titleBn: 'পেশির তীব্র টান, অনিদ্রা ও মানসিক ক্লান্তি',
      icon: Brain,
      recommendedServiceId: 'acupressure',
      adviceEn: [
        'Acupressure releases trigger points and promotes deep parasympathetic relaxation.',
        'Practice gentle neck and shoulder stretching twice daily.',
        'Avoid late-night blue light exposure.'
      ],
      adviceBn: [
        'সুনির্দিষ্ট আকুপ্রেশার পয়েন্টে চাপ দিয়ে পেশির শক্ত ভাব ও টেনশন সহজে দূর করা যায়।',
        'প্রতিদিন সকালে ও সন্ধ্যায় মৃদু স্ট্রেচিং বা ব্যায়াম করুন।',
        'প্রাকৃতিক উপায়ে কোনো পার্শ্বপ্রতিক্রিয়া ছাড়া ঘুম ও মানসিক শান্তি ফিরে আসে।'
      ]
    },
    {
      id: 'speech-delay',
      titleEn: 'Child Speech Delay, Stammering or Post-Stroke Aphasia',
      titleBn: 'শিশুর দেরিতে কথা বলা, তোতলামি বা স্ট্রোকের পর কথা বন্ধ হওয়া',
      icon: Baby,
      recommendedServiceId: 'speech-therapy',
      adviceEn: [
        'Structured Speech & Language Therapy accelerates articulation and vocabulary in children.',
        'For adults recovering from stroke, neuro-speech exercises restore sentence formation.',
        'Early screening prevents lifelong social communication anxiety.'
      ],
      adviceBn: [
        'দেরিতে কথা বলা শিশুদের মুখে শব্দ ও বাক্যের বিকাশ ঘটাতে স্পিচ থেরাপি অত্যন্ত কার্যকর।',
        'স্ট্রোকের পর কথা আটকে যাওয়া রোগীদের বাকশক্তি পুনরুদ্ধারে নিয়মিত সেশন জরুরি।',
        'দেরি না করে বিশেষজ্ঞ স্পিচ থেরাপিস্টের সাথে পরামর্শ করুন।'
      ]
    },
    {
      id: 'holistic-vitality',
      titleEn: 'IBS, Chronic Acidity & Holistic Recovery',
      titleBn: 'পুরনো আইবিএস, গ্যাস্ট্রিক ও দুর্বলতা',
      icon: Sparkles,
      recommendedServiceId: 'natural-healthcare',
      adviceEn: [
        'Balancing gut microbiota and natural herbal lifestyle guidance reduces chronic inflammation.',
        'Avoid processed refined sugars and hydrogenated oils.',
        'Personalized natural health blueprint enhances body resilience.'
      ],
      adviceBn: [
        'প্রাকৃতিক খাদ্যাভ্যাস ও ভেষজ সমন্বয় পেটের পুরনো প্রদাহ ও দুর্বলতা নিরাময় করে।',
        'অতিরিক্ত তেল-মশলাযুক্ত খাবার বর্জন করুন এবং সময়মতো খাবার গ্রহণ করুন।',
        'প্রাকৃতিক জীবনযাত্রার পরামর্শে ওষুধ নির্ভরতা কমিয়ে সুস্থ থাকুন।'
      ]
    }
  ];

  const currentConditionObj =
    conditions.find((c) => c.id === selectedCondition) || conditions[0];
  const recommendedService =
    SERVICES_DATA.find((s) => s.id === currentConditionObj.recommendedServiceId) ||
    SERVICES_DATA[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t('Instant Assessment & Therapy Guidance', 'স্বয়ংক্রিয় ব্যথা ও স্বাস্থ্য পরীক্ষা')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ textWrap: 'balance' }}>
          {t('Find the Right Therapy for Your Condition', 'আপনার সমস্যার জন্য সঠিক থেরাপি নির্বাচন করুন')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
          {t(
            'Select your primary symptom below to receive immediate clinical guidance and see which department (Hijama, Acupuncture, Acupressure, Physiotherapy, or Speech Therapy) offers the best outcome.',
            'আপনার প্রধান শারীরিক লক্ষণটি নির্বাচন করুন এবং জেনে নিন কোন থেরাপিটি আপনার রোগ নিরাময়ে সর্বাধিক কার্যকর।'
          )}
        </p>
      </div>

      {/* Step 1: Select Main Issue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          1. {t('Select Your Primary Health Symptom', 'আপনার প্রধান শারীরিক সমস্যা নির্বাচন করুন')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {conditions.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCondition === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedCondition(item.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Severity & Duration */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          2. {t('Symptom Severity & How Long You Have Had It', 'ব্যথার মাত্রা ও স্থায়িত্ব')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('Pain / Discomfort Level', 'ব্যথার তীব্রতা')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['mild', 'moderate', 'severe'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSeverity(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border capitalize transition-colors cursor-pointer ${
                    severity === lvl
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {lvl === 'mild'
                    ? t('Mild', 'মৃদু')
                    : lvl === 'moderate'
                    ? t('Moderate', 'মাঝারি')
                    : t('Severe', 'তীব্র')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('Problem Duration', 'সমস্যার সময়কাল')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setDuration('days')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  duration === 'days'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t('1 - 7 Days', 'কয়েকদিন')}
              </button>
              <button
                onClick={() => setDuration('weeks')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  duration === 'weeks'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t('Few Weeks', 'কয়েক সপ্তাহ')}
              </button>
              <button
                onClick={() => setDuration('chronic')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  duration === 'chronic'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t('Months / Years', 'মাস বা বছর')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Therapy Solution Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              {t('Recommended Therapy Department', 'সুপারিশকৃত বিশেষজ্ঞ থেরাপি')}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {lang === 'bn' ? recommendedService.titleBn : recommendedService.titleEn}
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-emerald-200 block">{t('Estimated Fee', 'নির্ধারিত ফি')}</span>
            <span className="text-2xl font-black text-white tabular-nums">৳{recommendedService.priceBdt}</span>
          </div>
        </div>

        {/* Clinical Care Advice */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide block">
            {t('Clinical Precautions & Care Advice:', 'প্রাথমিক করণীয় ও পরামর্শ:')}
          </span>
          <div className="space-y-2">
            {(lang === 'bn' ? currentConditionObj.adviceBn : currentConditionObj.adviceEn).map(
              (adv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{adv}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Booking CTA Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-800">
          <div className="text-xs text-emerald-200 text-center sm:text-left">
            {t(
              'Available at Town Chikandi Bazar, Shariatpur or Home visit upon request.',
              'টাউন চিকন্দি বাজার কেন্দ্রে অথবা বাসায় হোম ভিজিট সেবায় উপলব্ধ।'
            )}
          </div>

          <button
            onClick={() => onSelectServiceForBooking(recommendedService)}
            className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-100 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('Book This Recommended Therapy', 'এই থেরাপির জন্য অ্যাপয়েন্টমেন্ট নিন')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

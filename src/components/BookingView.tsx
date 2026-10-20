import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES_DATA, THERAPISTS_DIRECTORY, CLINIC_INFO } from '../data/therapyData';
import { ServiceItem, Therapist, Appointment } from '../types/therapy';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  MessageCircle,
  FileText,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Printer
} from 'lucide-react';

interface BookingViewProps {
  preselectedService?: ServiceItem | null;
  preselectedTherapist?: Therapist | null;
  onAppointmentCreated: (appointment: Appointment) => void;
  onGoBack?: () => void;
  onSelectTab: (tab: string) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({
  preselectedService,
  preselectedTherapist,
  onAppointmentCreated,
  onGoBack,
  onSelectTab
}) => {
  const { lang, t } = useLanguage();

  // Form State
  const [serviceId, setServiceId] = useState<string>(
    preselectedService ? preselectedService.id : SERVICES_DATA[0].id
  );
  const [therapistId, setTherapistId] = useState<string>(
    preselectedTherapist ? preselectedTherapist.id : 'any'
  );
  const [visitType, setVisitType] = useState<'center' | 'home'>('center');
  const [upazila, setUpazila] = useState<string>(CLINIC_INFO.upazilas[0].en);
  const [address, setAddress] = useState<string>('');

  // Generate next 14 dates for appointment selection
  const today = new Date();
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      weekday: 'short'
    });
    const dayNum = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
    return { dateStr, dayName, dayNum };
  });

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0].dateStr);

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM'
  ];

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [complaintNotes, setComplaintNotes] = useState('');

  // Validation & Submission
  const [errorMsg, setErrorMsg] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  const selectedService = SERVICES_DATA.find((s) => s.id === serviceId) || SERVICES_DATA[0];
  const selectedTherapistObj =
    therapistId === 'any'
      ? null
      : THERAPISTS_DIRECTORY.find((th) => th.id === therapistId);

  const estimatedTotal =
    visitType === 'home'
      ? 1200
      : selectedTherapistObj
      ? selectedTherapistObj.consultationFeeBdt
      : selectedService.priceBdt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg(t('Please enter patient name', 'অনুগ্রহ করে রোগীর নাম লিখুন'));
      return;
    }

    const cleanPhone = patientPhone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg(
        t(
          'Please enter a valid mobile number (e.g., 017... or 014...)',
          'অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন (যেমন: 017... বা 014...)'
        )
      );
      return;
    }

    if (visitType === 'home' && !address.trim()) {
      setErrorMsg(
        t(
          'Please specify the home address in Shariatpur for the therapist visit',
          'হোম ভিজিটের জন্য আপনার সঠিক ঠিকানা/গ্রামের নাম লিখুন'
        )
      );
      return;
    }

    const newId = `STH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: newId,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientAge: patientAge.trim() || '35',
      patientGender,
      serviceId,
      serviceTitle: lang === 'bn' ? selectedService.titleBn : selectedService.titleEn,
      therapistId,
      therapistName: selectedTherapistObj
        ? lang === 'bn'
          ? selectedTherapistObj.nameBn
          : selectedTherapistObj.nameEn
        : lang === 'bn'
        ? 'উপলব্ধ বিশেষজ্ঞ চিকিৎসক'
        : 'Any Available Specialist',
      visitType,
      upazila,
      address: visitType === 'home' ? address.trim() : CLINIC_INFO.addressEn,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      notes: complaintNotes.trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      totalBdt: estimatedTotal
    };

    onAppointmentCreated(newAppointment);
    setCreatedAppointment(newAppointment);
  };

  const constructWhatsAppMessage = (apt: Appointment) => {
    return encodeURIComponent(
      `*New Appointment Booking - Shariatpur Therapy Hub*\n` +
      `-----------------------------------------\n` +
      `*Booking ID:* ${apt.id}\n` +
      `*Patient Name:* ${apt.patientName}\n` +
      `*Contact Phone:* ${apt.patientPhone}\n` +
      `*Age & Gender:* ${apt.patientAge} Yrs, ${apt.patientGender}\n` +
      `*Therapy Service:* ${apt.serviceTitle}\n` +
      `*Assigned Doctor:* ${apt.therapistName}\n` +
      `*Visit Type:* ${apt.visitType === 'home' ? 'Home Visit (হোম ভিজিট)' : 'Town Chikandi Clinic'}\n` +
      `*Upazila / Area:* ${apt.upazila}\n` +
      (apt.address ? `*Address:* ${apt.address}\n` : '') +
      `*Date:* ${apt.date}\n` +
      `*Time Slot:* ${apt.timeSlot}\n` +
      (apt.notes ? `*Complaint / Problem:* ${apt.notes}\n` : '') +
      `*Total Fee:* ৳${apt.totalBdt} BDT\n` +
      `-----------------------------------------\n` +
      `Please confirm my appointment slot at Town Chikandi Bazar, Shariatpur.`
    );
  };

  // If appointment was just confirmed
  if (createdAppointment) {
    const waUrl = `https://wa.me/${CLINIC_INFO.whatsappClean}?text=${constructWhatsAppMessage(createdAppointment)}`;

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-2">
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-md text-center space-y-5">
          {/* Clinic Brand Header with Logo and Doctor Photo */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-left">
              <img
                src={CLINIC_INFO.logo}
                alt="শরীয়তপুর থেরাপি হাব লোগো"
                className="w-12 h-12 rounded-full object-contain shadow-xs border border-amber-300 bg-white shrink-0"
              />
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  {lang === 'bn' ? CLINIC_INFO.nameBn : CLINIC_INFO.nameEn}
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold block">
                  {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-right">
              <img
                src={CLINIC_INFO.doctorPortrait}
                alt="Therapist Abdullah"
                className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
              />
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-slate-900 block">
                  {lang === 'bn' ? CLINIC_INFO.leadDoctorNameBn : CLINIC_INFO.leadDoctorNameEn}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {lang === 'bn' ? CLINIC_INFO.leadDoctorTitleBn : CLINIC_INFO.leadDoctorTitleEn}
                </span>
              </div>
            </div>
          </div>

          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              {t('Booking Confirmed & Saved', 'বুকিং সফলভাবে সম্পন্ন হয়েছে')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('Appointment Token: ', 'অ্যাপয়েন্টমেন্ট টোকেন: ')}
              <span className="text-emerald-700">{createdAppointment.id}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {t(
                'Your session is scheduled. For instant priority confirmation and therapist notification, send this slip directly to our clinic WhatsApp.',
                'আপনার সেশনটি নিবন্ধিত হয়েছে। তাৎক্ষণিক কনফার্মেশন ও সিরিয়াল নিশ্চিত করতে স্লিপটি আমাদের হোয়াটসঅ্যাপে পাঠিয়ে দিন।'
              )}
            </p>
          </div>

          {/* Appointment Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t('Patient Name', 'রোগীর নাম')}</span>
              <span className="font-bold text-slate-900">{createdAppointment.patientName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t('Service', 'থেরাপি সেবা')}</span>
              <span className="font-bold text-emerald-800">{createdAppointment.serviceTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t('Therapist', 'থেরাপিস্ট')}</span>
              <span className="font-semibold text-slate-900">{createdAppointment.therapistName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t('Date & Time', 'তারিখ ও সময়')}</span>
              <span className="font-bold text-slate-900">
                {createdAppointment.date} · {createdAppointment.timeSlot}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">{t('Location', 'অবস্থান')}</span>
              <span className="font-medium text-slate-800 text-right">
                {createdAppointment.visitType === 'home'
                  ? t(`Home Visit: ${createdAppointment.upazila}`, `হোম ভিজিট: ${createdAppointment.upazila}`)
                  : CLINIC_INFO.locationBn}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-slate-700">{t('Estimated Fee', 'মোট ফি')}</span>
              <span className="font-extrabold text-emerald-800 text-base">
                ৳{createdAppointment.totalBdt}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('Send Slip to WhatsApp (01402893006)', 'হোয়াটসঅ্যাপে পাঠান (01402893006)')}</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{t('View on Google Maps', 'গুগল ম্যাপে লোকেশন')}</span>
              </a>

              <button
                onClick={() => onSelectTab('appointments')}
                className="min-h-[44px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t('View My Visits', 'আমার অ্যাপয়েন্টমেন্ট')}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="min-h-[44px] py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print Slip', 'রসিদ প্রিন্ট করুন')}</span>
              </button>
            </div>
          </div>

          {/* Privacy Guarantee Notice */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 text-left text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t(
                'Patient Privacy Guarantee: Your personal medical details are strictly confidential and stored on your local device. Private medical records are never published publicly or shared with unauthorized third parties.',
                'রোগীর গোপনীয়তা সুরক্ষা: আপনার ব্যক্তিগত স্বাস্থ্য তথ্য সম্পূর্ণ নিরাপদ ও সুরক্ষিত। কোনো ব্যক্তিগত মেডিকেল তথ্য প্রকাশ্যে প্রচার করা হয় না।'
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onGoBack && (
              <button
                onClick={onGoBack}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('Book a Therapy Appointment', 'অ্যাপয়েন্টমেন্ট ও কনসালটেশন বুকিং')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              'Town Chikandi Bazar Clinic or Home Care across Shariatpur',
              'টাউন চিকন্দি বাজার কেন্দ্র অথবা শরীয়তপুরের উপজেলায় হোম ভিজিট'
            )}
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-500 block">{t('Help Hotline / WhatsApp', 'হেল্পলাইন ও হোয়াটসঅ্যাপ')}</span>
          <a
            href={`https://wa.me/${CLINIC_INFO.whatsappClean}`}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 justify-end"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>01402893006</span>
          </a>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Therapy Service & Consultation Type */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            1. {t('Select Therapy & Visit Preference', 'থেরাপির ধরন ও চিকিৎসা কেন্দ্র নির্বাচন')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('Required Therapy / Treatment', 'প্রয়োজনীয় থেরাপি')}
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {lang === 'bn' ? srv.titleBn : srv.titleEn} (৳{srv.priceBdt})
                  </option>
                ))}
              </select>
            </div>

            {/* Visit Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t('Where would you like the session?', 'চিকিৎসা কোথায় নিতে চান?')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType('center')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    visitType === 'center'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t('Town Chikandi Clinic', 'চিকন্দি বাজার কেন্দ্র')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('home')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    visitType === 'home'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{t('Home Therapy Visit', 'বাসায় হোম ভিজিট')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upazila & Address if Home visit */}
          {visitType === 'home' && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('Select Shariatpur Upazila', 'শরীয়তপুরের উপজেলা নির্বাচন')}
                  </label>
                  <select
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {CLINIC_INFO.upazilas.map((u) => (
                      <option key={u.en} value={u.en}>
                        {lang === 'bn' ? u.bn : u.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t('Home Address / Village / Landmark', 'গ্রাম, পাড়া ও সুনির্দিষ্ট ঠিকানা')}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('e.g., Near Bazar, Master Bari, Union...', 'যেমন: বাজার সংলগ্ন, মাস্টার বাড়ি, ইউনিয়ন...')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-800">
                {t(
                  'Home therapy service includes mobile electrotherapy machine and certified therapist transport.',
                  'হোম থেরাপিতে পোর্টেবল ইলেকট্রোথেরাপি মেশিন ও থেরাপিস্টের যাতায়াত অন্তর্ভুক্ত।'
                )}
              </p>
            </div>
          )}

          {/* Preferred Therapist Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('Preferred Specialist / Doctor', 'পছন্দের থেরাপিস্ট / চিকিৎসক')}
            </label>
            <select
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="any">
                {t('★ Any Available Qualified Specialist (Fastest Confirmation)', '★ যেকোনো উপলব্ধ অভিজ্ঞ চিকিৎসক (দ্রুত কনফার্মেশন)')}
              </option>
              {THERAPISTS_DIRECTORY.map((th) => (
                <option key={th.id} value={th.id}>
                  {lang === 'bn' ? th.nameBn : th.nameEn} ({lang === 'bn' ? th.designationBn : th.designationEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Date & Time Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            2. {t('Select Preferred Date & Time', 'তারিখ ও সময় নির্বাচন')}
          </h2>

          {/* Date Scroller */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t('Select Date', 'তারিখ নির্বাচন')}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
              {availableDates.map((d) => (
                <button
                  type="button"
                  key={d.dateStr}
                  onClick={() => setSelectedDate(d.dateStr)}
                  className={`min-w-[70px] p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    selectedDate === d.dateStr
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-[10px] uppercase">{d.dayName}</span>
                  <span className="block text-xs font-extrabold mt-0.5">{d.dayNum}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-700">
              {t('Select Time Slot', 'সময় নির্বাচন (স্লট)')}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    selectedTimeSlot === slot
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Patient Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            3. {t('Patient Details & Problem', 'রোগীর তথ্য ও সমস্যার বিবরণ')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Patient Full Name *', 'রোগীর পূর্ণ নাম *')}
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={t('e.g., Abdul Karim', 'যেমন: আব্দুল করিম')}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Mobile Contact Number (01...) *', 'মোবাইল নম্বর (০১৭... বা ০১৪...) *')}
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Patient Age (Years)', 'রোগীর বয়স')}
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="45"
                min="1"
                max="110"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('Patient Gender', 'লিঙ্গ')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPatientGender('male')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    patientGender === 'male'
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t('Male (পুরুষ)', 'পুরুষ')}
                </button>
                <button
                  type="button"
                  onClick={() => setPatientGender('female')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    patientGender === 'female'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {t('Female (মহিলা)', 'মহিলা')}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('Chief Complaint / Symptoms Description', 'শারীরিক সমস্যা বা ব্যথার সংক্ষিপ্ত বিবরণ')}
            </label>
            <textarea
              rows={3}
              value={complaintNotes}
              onChange={(e) => setComplaintNotes(e.target.value)}
              placeholder={t(
                'Describe where the pain is, duration, stroke history, or if you prefer female therapist...',
                'ব্যথার স্থান, কতদিন ধরে সমস্যা, স্ট্রোকের ইতিহাস বা কোনো বিশেষ পরামর্শ থাকলে লিখুন...'
              )}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 resize-none"
            />
          </div>
        </div>

        {/* Total & Submit Button */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              {t('Total Estimated Fee', 'মোট নির্ধারিত ফি')}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-800">
              ৳{estimatedTotal}{' '}
              <span className="text-xs font-normal text-slate-500">
                {visitType === 'home'
                  ? t('(Home Visit in Shariatpur)', '(শরীয়তপুরে হোম ভিজিট)')
                  : t('(Town Chikandi Clinic)', '(চিকন্দি বাজার কেন্দ্র)')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('Confirm Appointment Now', 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

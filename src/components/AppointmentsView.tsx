import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Appointment } from '../types/therapy';
import { CLINIC_INFO } from '../data/therapyData';
import {
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onBookNew: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onCancelAppointment,
  onBookNew
}) => {
  const { lang, t } = useLanguage();
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (!searchPhone.trim()) return true;
    return (
      apt.patientPhone.includes(searchPhone.trim()) ||
      apt.id.toLowerCase().includes(searchPhone.trim().toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchPhone.trim().toLowerCase())
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('My Appointments & Treatment Slips', 'আমার অ্যাপয়েন্টমেন্ট ও চিকিৎসা স্লিপ')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t(
              'Track scheduled therapy sessions at Town Chikandi Bazar or Home visits',
              'টাউন চিকন্দি কেন্দ্র বা হোম ভিজিটের অ্যাপয়েন্টমেন্টের বর্তমান অবস্থা'
            )}
          </p>
        </div>

        <button
          onClick={onBookNew}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>{t('Book New Session', 'নতুন অ্যাপয়েন্টমেন্ট')}</span>
        </button>
      </div>

      {/* Patient Privacy Statement */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t(
            'Patient Medical Privacy Guarantee: Your appointment records and medical conditions are stored securely and never published publicly. You can safely present your digital token at the reception desk in Town Chikandi Bazar.',
            'রোগীর চিকিৎসা তথ্যের পূর্ণ নিরাপত্তা: আপনার শারীরিক সমস্যার বিবরণ এবং যোগাযোগের তথ্য সম্পূর্ণ ব্যক্তিগত। চিকন্দি বাজারে ক্লিনিকে উপস্থিত হয়ে আপনার এই ডিজিটাল টোকেনটি রিসেপশনে প্রদর্শন করুন।'
          )}
        </p>
      </div>

      {/* Search Input for Patients with multiple visits */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          placeholder={t(
            'Filter by phone number, patient name, or token ID...',
            'ফোন নম্বর, রোগীর নাম বা টোকেন আইডি দিয়ে খুঁজুন...'
          )}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
        {searchPhone && (
          <button
            onClick={() => setSearchPhone('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {t('No appointment records found', 'কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি')}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t(
                'Book your first physiotherapy, hijama, or acupuncture session with our specialists.',
                'শরীয়তপুর থেরাপি হাবে আপনার প্রথম সেশনটি সহজেই অনলাইন বা ফোনে বুক করুন।'
              )}
            </p>
          </div>
          <button
            onClick={onBookNew}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            {t('Book First Session', 'প্রথম সেশন বুক করুন')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
                    {apt.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-0.5 rounded-full capitalize ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : apt.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {apt.status === 'confirmed'
                      ? t('Confirmed', 'নিশ্চিত')
                      : apt.status === 'completed'
                      ? t('Completed', 'সম্পন্ন')
                      : apt.status === 'cancelled'
                      ? t('Cancelled', 'বাতিল')
                      : t('Pending', 'অপেক্ষমান')}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                    ৳{apt.totalBdt}
                  </span>
                </div>
              </div>

              {/* Grid Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t('Therapy Service', 'থেরাপির ধরন')}
                  </span>
                  <span className="font-bold text-slate-800 text-sm block">{apt.serviceTitle}</span>
                  <span className="text-emerald-800 font-medium">{apt.therapistName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t('Date & Time Slot', 'তারিখ ও সময়')}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    {t('Location Type', 'চিকিৎসার স্থান')}
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">
                      {apt.visitType === 'home'
                        ? t(`Home Visit: ${apt.upazila}`, `হোম ভিজিট: ${apt.upazila}`)
                        : t('Town Chikandi Clinic', 'টাউন চিকন্দি ক্লিনিক')}
                    </span>
                  </div>
                  <span className="text-slate-500 block text-[11px]">
                    {t('Phone: ', 'ফোন: ')}
                    {apt.patientPhone}
                  </span>
                </div>
              </div>

              {apt.notes && (
                <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 border border-slate-100">
                  <span className="font-semibold text-slate-700">{t('Problem Note: ', 'শারীরিক লক্ষণ: ')}</span>
                  <span>{apt.notes}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedApt(apt)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('View Digital Slip', 'ডিজিটাল স্লিপ দেখুন')}</span>
                  </button>

                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
                      `Hello Shariatpur Therapy Hub, checking my booking ${apt.id} for ${apt.patientName} on ${apt.date}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {apt.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      if (window.confirm(t('Are you sure you want to cancel this appointment?', 'আপনি কি সত্যিই এই অ্যাপয়েন্টমেন্ট বাতিল করতে চান?'))) {
                        onCancelAppointment(apt.id);
                      }
                    }}
                    className="text-xs font-medium text-red-600 hover:text-red-800 p-1 cursor-pointer"
                  >
                    {t('Cancel Booking', 'অ্যাপয়েন্টমেন্ট বাতিল করুন')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Slip Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-emerald-200 relative">
            <button
              onClick={() => setSelectedApt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slip Header with Logo & Doctor Photo */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-left">
                <img
                  src={CLINIC_INFO.logo}
                  alt="শরীয়তপুর থেরাপি হাব লোগো"
                  className="w-11 h-11 rounded-full object-contain shadow-xs border border-amber-300 bg-white shrink-0"
                />
                <div>
                  <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider block">
                    {lang === 'bn' ? CLINIC_INFO.nameBn : CLINIC_INFO.nameEn}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
                  </span>
                </div>
              </div>

              <img
                src={CLINIC_INFO.doctorPortrait}
                alt="Therapist Abdullah"
                className="w-10 h-10 rounded-full object-cover border border-amber-300 shrink-0"
              />
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base font-extrabold text-slate-900">
                {t('Appointment Receipt / Token', 'ডিজিটাল অ্যাপয়েন্টমেন্ট স্লিপ')}
              </h2>
              <p className="text-[11px] text-slate-500">
                {CLINIC_INFO.locationBn} · {CLINIC_INFO.whatsappFull}
              </p>
            </div>

            {/* Token Badge */}
            <div className="text-center bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
              <span className="text-[10px] text-emerald-900 uppercase font-bold block">{t('Token Number', 'টোকেন নম্বর')}</span>
              <span className="text-2xl font-black text-emerald-800 tracking-wide font-mono">
                {selectedApt.id}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Patient Name', 'রোগীর নাম')}</span>
                <span className="font-bold text-slate-900">{selectedApt.patientName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Contact Phone', 'মোবাইল')}</span>
                <span className="font-semibold">{selectedApt.patientPhone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Therapy Service', 'থেরাপি')}</span>
                <span className="font-bold text-emerald-800">{selectedApt.serviceTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Attending Specialist', 'থেরাপিস্ট')}</span>
                <span className="font-semibold">{selectedApt.therapistName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Scheduled Date & Time', 'তারিখ ও সময়')}</span>
                <span className="font-bold text-slate-900">{selectedApt.date} · {selectedApt.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">{t('Location', 'স্থান')}</span>
                <span className="font-medium">
                  {selectedApt.visitType === 'home'
                    ? t(`Home Visit: ${selectedApt.upazila}`, `হোম ভিজিট (${selectedApt.upazila})`)
                    : t('Town Chikandi Bazar Clinic', 'টাউন চিকন্দি বাজার কেন্দ্র')}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">{t('Estimated Fee', 'মোট ফি')}</span>
                <span className="text-base font-extrabold text-emerald-800">৳{selectedApt.totalBdt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>{t('Open Clinic in Google Maps', 'গুগল ম্যাপে ক্লিনিক লোকেশন')}</span>
              </a>

              <button
                onClick={() => window.print()}
                className="w-full min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t('Print This Slip', 'রসিদটি প্রিন্ট করুন')}</span>
              </button>

              <button
                onClick={() => setSelectedApt(null)}
                className="w-full min-h-[40px] rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                {t('Close', 'বন্ধ করুন')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

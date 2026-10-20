import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Appointment, Therapist, ServiceItem } from '../types/therapy';
import { SERVICES_DATA, THERAPISTS_DIRECTORY, CLINIC_INFO } from '../data/therapyData';
import {
  Lock,
  Unlock,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  Download,
  Plus,
  Trash2,
  Calendar,
  User,
  Shield,
  Layers,
  MapPin,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onDeleteAppointment: (id: string) => void;
  onAddAppointment: (apt: Appointment) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  onUpdateStatus,
  onDeleteAppointment,
  onAddAppointment
}) => {
  const { lang, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');
  const [visitFilter, setVisitFilter] = useState<'all' | 'center' | 'home'>('all');

  // Walk-in modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newServiceId, setNewServiceId] = useState(SERVICES_DATA[0].id);
  const [newTherapistId, setNewTherapistId] = useState(THERAPISTS_DIRECTORY[0].id);
  const [newVisitType, setNewVisitType] = useState<'center' | 'home'>('center');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState('10:00 AM');

  const correctPin = '1234';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === correctPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = appointments.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = appointments.filter((a) => a.date === todayStr).length;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
    const completedCount = appointments.filter((a) => a.status === 'completed').length;
    const homeVisits = appointments.filter((a) => a.visitType === 'home').length;
    const totalEstRevenue = appointments
      .filter((a) => a.status !== 'cancelled')
      .reduce((sum, a) => sum + (a.totalBdt || 650), 0);

    return { total, todayCount, confirmedCount, completedCount, homeVisits, totalEstRevenue };
  }, [appointments]);

  // Filtered List
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      if (visitFilter !== 'all' && apt.visitType !== visitFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = apt.patientName.toLowerCase().includes(q);
        const matchesPhone = apt.patientPhone.includes(q);
        const matchesId = apt.id.toLowerCase().includes(q);
        const matchesService = apt.serviceTitle.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesId || matchesService;
      }
      return true;
    });
  }, [appointments, statusFilter, visitFilter, searchQuery]);

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientPhone.trim()) return;

    const srv = SERVICES_DATA.find((s) => s.id === newServiceId) || SERVICES_DATA[0];
    const th = THERAPISTS_DIRECTORY.find((t) => t.id === newTherapistId) || THERAPISTS_DIRECTORY[0];

    const newApt: Appointment = {
      id: `STH-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newPatientName.trim(),
      patientPhone: newPatientPhone.trim(),
      patientAge: '35',
      patientGender: 'male',
      serviceId: srv.id,
      serviceTitle: lang === 'bn' ? srv.titleBn : srv.titleEn,
      therapistId: th.id,
      therapistName: lang === 'bn' ? th.nameBn : th.nameEn,
      visitType: newVisitType,
      upazila: CLINIC_INFO.upazilas[0].en,
      date: newDate,
      timeSlot: newTimeSlot,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      totalBdt: newVisitType === 'home' ? 1200 : srv.priceBdt
    };

    onAddAppointment(newApt);
    setShowAddModal(false);
    setNewPatientName('');
    setNewPatientPhone('');
  };

  const exportCSV = () => {
    const headers = 'Token,Patient Name,Phone,Service,Therapist,Visit Type,Date,Time,Status,Fee\n';
    const rows = appointments
      .map(
        (a) =>
          `"${a.id}","${a.patientName}","${a.patientPhone}","${a.serviceTitle}","${a.therapistName}","${a.visitType}","${a.date}","${a.timeSlot}","${a.status}","${a.totalBdt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shariatpur_therapy_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            {t('Reception & Admin Portal', 'এডমিন ও রিসেপশন পোর্টাল')}
          </h2>
          <p className="text-xs text-slate-500">
            {t(
              'Enter clinic access PIN to manage appointments and patient queue',
              'রোগীদের অ্যাপয়েন্টমেন্ট তালিকা ও সিরিয়াল দেখতে পিন কোড দিন'
            )}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              placeholder={t('Enter PIN (Default: 1234)', 'পিন দিন (ডিফল্ট: 1234)')}
              className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {pinError && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">
                {t('Incorrect PIN. Please try default "1234"', 'ভুল পিন কোড। ডিফল্ট "1234" দিয়ে চেষ্টা করুন')}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t('Unlock Admin Dashboard', 'লগইন করুন')}
          </button>
        </form>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-500 text-left">
          <span className="font-semibold text-slate-700 block mb-0.5">{t('Quick Access Hint:', 'দ্রুত প্রবেশ সহায়িকা:')}</span>
          <span>{t('Use PIN: 1234 to preview the clinic management dashboard.', 'এডমিন ড্যাশবোর্ড দেখতে পিন "1234" ব্যবহার করুন।')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Backend & Security Architecture Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-900 block">
              {t(
                'Security Notice: Patient Data Protection & Backend Integration Boundary',
                'নিরাপত্তা বিজ্ঞপ্তি: রোগীর তথ্য সুরক্ষা ও ব্যাকএন্ড ইন্টিগ্রেশন'
              )}
            </span>
            <p className="text-emerald-800 leading-relaxed">
              {t(
                'Appointments are currently managed securely on this device (Local Storage). Real-time multi-receptionist cloud synchronization, SMS automated reminders, and encrypted medical records require a dedicated Firebase / Cloud SQL backend with role-based authentication (RBAC).',
                'বর্তমানে অ্যাপয়েন্টমেন্টগুলো ডিভাইসে সুরক্ষিতভাবে সংরক্ষিত। একাধিক কম্পিউটার থেকে রিয়েল-টাইম ক্লাউড সিঙ্ক এবং স্বয়ংক্রিয় এসএমএস অ্যালার্টের জন্য ব্যাকএন্ড অথেন্টিকেশন প্রয়োজন।'
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-semibold hover:bg-emerald-100 text-xs shrink-0 self-end md:self-auto cursor-pointer"
        >
          {t('Lock Dashboard', 'লক করুন')}
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            {t('Total Appointments', 'মোট অ্যাপয়েন্টমেন্ট')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {metrics.total}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics.todayCount} {t('scheduled for today', 'আজকের শিডিউল')}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase block">
            {t('Confirmed Sessions', 'নিশ্চিত সেশন')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
            {metrics.confirmedCount}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics.completedCount} {t('marked completed', 'সম্পন্ন হয়েছে')}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-blue-700 uppercase block">
            {t('Home Therapy Visits', 'হোম ভিজিট সেবা')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 tabular-nums">
            {metrics.homeVisits}
          </div>
          <span className="text-[11px] text-slate-500">
            {t('Across Shariatpur upazilas', 'উপজেলাগুলোতে বাসায় সেবা')}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">
            {t('Est. Session Value', 'মোট সেশন মূল্য')}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tabular-nums">
            ৳{metrics.totalEstRevenue}
          </div>
          <span className="text-[11px] text-slate-500">
            {t('Based on standard fees', 'নির্ধারিত ফি হিসাব')}
          </span>
        </div>
      </div>

      {/* Action Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('Patient Appointments & Queue Management', 'রোগীদের অ্যাপয়েন্টমেন্ট ও সিরিয়াল তালিকা')}
            </h2>
            <p className="text-xs text-slate-500">
              {t(
                'Confirm, reschedule, or register walk-in patients arriving at Town Chikandi Bazar',
                'টাউন চিকন্দি বাজারে আগত রোগীদের সিরিয়াল নিশ্চিত ও হালনাগাদ করুন'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('New Walk-In', 'নতুন সিরিয়াল')}</span>
            </button>

            <button
              onClick={exportCSV}
              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Download Appointments CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search patient, phone, ID...', 'রোগী, ফোন বা টোকেন আইডি দিয়ে খুঁজুন...')}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-1 py-1 text-[11px] font-medium rounded-md capitalize transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Visit Type */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setVisitFilter('all')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                visitFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              {t('All Types', 'সকল')}
            </button>
            <button
              onClick={() => setVisitFilter('center')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                visitFilter === 'center' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              {t('Clinic', 'ক্লিনিক')}
            </button>
            <button
              onClick={() => setVisitFilter('home')}
              className={`flex-1 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                visitFilter === 'home' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              {t('Home', 'হোম')}
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-xs space-y-2">
          <Calendar className="w-8 h-8 mx-auto text-slate-300" />
          <p>{t('No appointments found for the selected filter.', 'নির্বাচিত ফিল্টারের আওতায় কোনো অ্যাপয়েন্টমেন্ট নেই।')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                      {apt.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{apt.patientName}</h3>
                    <span className="text-xs text-slate-500">
                      ({apt.patientAge} Y, {apt.patientGender})
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : apt.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                      ৳{apt.totalBdt}
                    </span>
                  </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('Service & Doctor', 'সেবা ও চিকিৎসক')}</span>
                    <span className="font-semibold text-slate-800">{apt.serviceTitle}</span>
                    <div className="text-[11px] text-slate-500">{apt.therapistName}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('Date & Time', 'তারিখ ও সময়')}</span>
                    <span className="font-semibold text-slate-800">{apt.date}</span> · {apt.timeSlot}
                    <div className="text-[11px] text-emerald-700">
                      {apt.visitType === 'home'
                        ? t(`Home Visit: ${apt.upazila}`, `হোম ভিজিট: ${apt.upazila}`)
                        : t('Town Chikandi Center', 'টাউন চিকন্দি ক্লিনিক')}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('Contact & Problem', 'যোগাযোগ ও লক্ষণ')}</span>
                    <span className="font-semibold text-slate-800">{apt.patientPhone}</span>
                    {apt.notes && <p className="text-[11px] text-slate-500 truncate">{apt.notes}</p>}
                  </div>
                </div>

                {/* Quick Action Toolbar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${apt.patientPhone}`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{t('Call', 'কল দিন')}</span>
                    </a>

                    <a
                      href={`https://wa.me/880${apt.patientPhone.replace(/^0+/, '')}?text=${encodeURIComponent(
                        lang === 'bn'
                          ? `আসসালামু আলাইকুম ${apt.patientName}, শরীয়তপুর থেরাপি হাব (টাউন চিকন্দি) থেকে আপনার ${apt.date}-এর অ্যাপয়েন্টমেন্ট সম্পর্কে যোগাযোগ করছি।`
                          : `Hello ${apt.patientName}, regarding your therapy appointment (${apt.id}) at Shariatpur Therapy Hub on ${apt.date}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Status Changers */}
                  <div className="flex items-center gap-1.5">
                    {apt.status !== 'confirmed' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'confirmed')}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-medium cursor-pointer"
                      >
                        {t('Confirm', 'কনফার্ম')}
                      </button>
                    )}
                    {apt.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'completed')}
                        className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 hover:bg-blue-100 text-[11px] font-medium cursor-pointer"
                      >
                        {t('Done', 'সম্পন্ন')}
                      </button>
                    )}
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => onUpdateStatus(apt.id, 'cancelled')}
                        className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-medium cursor-pointer"
                      >
                        {t('Cancel', 'বাতিল')}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteAppointment(apt.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Walk-in Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {t('Register Walk-In Patient', 'নতুন রোগী / সিরিয়াল এন্ট্রি')}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('Patient Full Name', 'রোগীর নাম')}
                </label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('Patient Phone Number', 'মোবাইল নম্বর')}
                </label>
                <input
                  type="tel"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('Service', 'থেরাপি')}
                  </label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {lang === 'bn' ? s.titleBn : s.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('Therapist', 'থেরাপিস্ট')}
                  </label>
                  <select
                    value={newTherapistId}
                    onChange={(e) => setNewTherapistId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    {THERAPISTS_DIRECTORY.map((th) => (
                      <option key={th.id} value={th.id}>
                        {lang === 'bn' ? th.nameBn : th.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('Date', 'তারিখ')}
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('Time', 'সময়')}
                  </label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  {t('Cancel', 'বাতিল')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  {t('Add Entry', 'যোগ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

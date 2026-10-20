/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { TherapistDirectory } from './components/TherapistDirectory';
import { BookingView } from './components/BookingView';
import { SymptomChecker } from './components/SymptomChecker';
import { AppointmentsView } from './components/AppointmentsView';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { INITIAL_APPOINTMENTS, CLINIC_INFO } from './data/therapyData';
import { Appointment, ServiceItem, Therapist } from './types/therapy';
import { MessageCircle, Phone, MapPin, ShieldCheck, Heart, Youtube } from 'lucide-react';

function AppContent() {
  const { lang, t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedTherapistForBooking, setSelectedTherapistForBooking] = useState<Therapist | null>(null);

  // Persistent appointments stored in local device storage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('sth_patient_appointments_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_APPOINTMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('sth_patient_appointments_v1', JSON.stringify(appointments));
    } catch {
      // ignore
    }
  }, [appointments]);

  // Tab switching with scroll to top
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    setSelectedServiceForBooking(null);
    setSelectedTherapistForBooking(null);
    handleSelectTab('book');
  };

  const handleOpenBookingWithService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setSelectedTherapistForBooking(null);
    handleSelectTab('book');
  };

  const handleOpenBookingWithTherapist = (therapist: Therapist) => {
    setSelectedTherapistForBooking(therapist);
    setSelectedServiceForBooking(null);
    handleSelectTab('book');
  };

  const handleAppointmentCreated = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  };

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddWalkIn = (newApt: Appointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 3-Zone Clean Header */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenBooking={handleOpenBooking}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 lg:pb-12">
        {currentTab === 'home' && (
          <HomeView
            onSelectTab={handleSelectTab}
            onOpenBookingWithService={handleOpenBookingWithService}
            onOpenBookingWithTherapist={handleOpenBookingWithTherapist}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView onSelectServiceForBooking={handleOpenBookingWithService} />
        )}

        {currentTab === 'therapists' && (
          <TherapistDirectory onBookTherapist={handleOpenBookingWithTherapist} />
        )}

        {currentTab === 'book' && (
          <BookingView
            preselectedService={selectedServiceForBooking}
            preselectedTherapist={selectedTherapistForBooking}
            onAppointmentCreated={handleAppointmentCreated}
            onGoBack={() => handleSelectTab('home')}
            onSelectTab={handleSelectTab}
          />
        )}

        {currentTab === 'checker' && (
          <SymptomChecker onSelectServiceForBooking={handleOpenBookingWithService} />
        )}

        {currentTab === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onBookNew={handleOpenBooking}
          />
        )}

        {currentTab === 'contact' && <ContactView />}

        {currentTab === 'admin' && (
          <AdminDashboard
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onAddAppointment={handleAddWalkIn}
          />
        )}
      </main>

      {/* Floating WhatsApp Action for Quick Inquiries */}
      <a
        href={`https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(
          lang === 'bn'
            ? 'আসসালামু আলাইকুম, আমি শরীয়তপুর থেরাপি হাবে সেবা সম্পর্কে জানতে চাই।'
            : 'Hello, I want to inquire about therapy services at Shariatpur Therapy Hub.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-30 lg:bottom-6 lg:right-6 bg-emerald-600 hover:bg-emerald-500 text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95"
        title="WhatsApp Hotline: 01402893006"
        aria-label="Direct WhatsApp Chat"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-xs font-bold">WhatsApp: 01402893006</span>
      </a>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        appointmentCount={appointments.filter((a) => a.status === 'confirmed').length}
      />

      {/* Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={CLINIC_INFO.logo}
                  alt="শরীয়তপুর থেরাপি হাব লোগো"
                  className="w-10 h-10 rounded-full object-contain bg-white border border-amber-300 shrink-0"
                />
                <span className="text-base font-bold text-white block">
                  {lang === 'bn' ? CLINIC_INFO.nameBn : CLINIC_INFO.nameEn}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {lang === 'bn' ? CLINIC_INFO.subNameBn : CLINIC_INFO.subNameEn}
              </p>
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium pt-1 hover:underline"
              >
                <MapPin className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{CLINIC_INFO.locationBn} ({t('Open Map', 'গুগল ম্যাপ')})</span>
              </a>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">
                {t('Available Therapies', 'উপলব্ধ থেরাপিসমূহ')}
              </span>
              <ul className="space-y-1 text-slate-400">
                <li>{t('Hijama & Cupping Therapy', 'হিজামা ও কাপিং থেরাপি')}</li>
                <li>{t('Clinical Acupuncture', 'আকুপাংচার থেরাপি')}</li>
                <li>{t('Acupressure & Reflexology', 'আকুপ্রেশার থেরাপি')}</li>
                <li>{t('Modern Physiotherapy', 'আধুনিক ফিজিওথেরাপি')}</li>
                <li>{t('Speech & Language Therapy', 'স্পিচ অ্যান্ড ল্যাঙ্গুয়েজ থেরাপি')}</li>
                <li>{t('Natural Healthcare', 'ন্যাচারাল হেলথকেয়ার')}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">
                {t('Coverage Areas', 'সেবা অঞ্চল')}
              </span>
              <p className="text-slate-400 leading-relaxed">
                {t(
                  'Town Chikandi Bazar Clinic & Home Visits across Shariatpur Sadar, Naria, Damudya, Bhedarganj, Gosairhat, and Zanjira.',
                  'টাউন চিকন্দি বাজার কেন্দ্র এবং শরীয়তপুর সদর, নড়িয়া, ডামুড্যা, ভেদরগঞ্জ, গোসাইরহাট ও জাজিরা উপজেলায় সার্বক্ষণিক হোম সার্ভিস।'
                )}
              </p>
              <div className="text-slate-300 pt-1">
                <span className="block">{t(CLINIC_INFO.hoursWeekdayEn, CLINIC_INFO.hoursWeekdayBn)}</span>
                <span className="block text-slate-400">{t(CLINIC_INFO.hoursFridayEn, CLINIC_INFO.hoursFridayBn)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider block text-[11px]">
                {t('Direct Hotlines', 'হটলাইন ও যোগাযোগ')}
              </span>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: 01402893006</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Phone: 01402893006</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  <span>{CLINIC_INFO.email}</span>
                </div>
                <div className="pt-2">
                  <a
                    href={CLINIC_INFO.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-xs"
                    title="Subscribe to our YouTube Channel"
                  >
                    <Youtube className="w-4 h-4 fill-white" />
                    <span>{t('Subscribe on YouTube', 'ইউটিউবে সাবস্ক্রাইব করুন')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <p>
              © {new Date().getFullYear()} Shariatpur Therapy Hub (Ash-Shifa Natural Care). All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{t('Patient Privacy Guaranteed · Town Chikandi Bazar, Shariatpur', 'রোগীর তথ্য নিরাপদ ও সংরক্ষিত · টাউন চিকন্দি বাজার')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

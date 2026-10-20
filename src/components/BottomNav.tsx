import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Home, Activity, Users, CalendarPlus, FileText } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  appointmentCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  appointmentCount = 0
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', labelEn: 'Home', labelBn: 'হোম', icon: Home },
    { id: 'services', labelEn: 'Therapies', labelBn: 'সেবা', icon: Activity },
    { id: 'book', labelEn: 'Book', labelBn: 'বুকিং', icon: CalendarPlus, highlight: true },
    { id: 'therapists', labelEn: 'Doctors', labelBn: 'থেরাপিস্ট', icon: Users },
    { id: 'appointments', labelEn: 'My Visits', labelBn: 'ভিজিট', icon: FileText, badge: appointmentCount > 0 ? appointmentCount : undefined }
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
                isActive ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.highlight ? (
                <div
                  className={`p-1.5 rounded-full mb-0.5 transition-transform ${
                    isActive ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className={`text-[10px] font-medium tracking-tight whitespace-nowrap ${isActive ? 'font-bold text-emerald-900' : ''}`}>
                {t(item.labelEn, item.labelBn)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

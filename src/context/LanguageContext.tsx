import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/therapy';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (en: string, bn: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Bengali ('bn') as requested
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sth_lang');
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('sth_lang', newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'bn' ? 'en' : 'bn');
  };

  // Helper returns Bengali by default when in 'bn' mode
  const t = (en: string, bn: string): string => {
    return lang === 'bn' ? bn : en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

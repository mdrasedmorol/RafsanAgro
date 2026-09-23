'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './dictionaries/en.json';
import bn from './dictionaries/bn.json';

type Dictionary = typeof en;
type Language = 'en' | 'bn';

interface I18nContextType {
  lang: Language;
  t: Dictionary;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const dictionaries: Record<Language, Dictionary> = { en, bn };

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: en,
  setLang: () => {},
  toggleLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('rafsan-agro-lang') as Language;
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLangState(saved);
      document.body.setAttribute('data-lang', saved);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('rafsan-agro-lang', newLang);
    document.body.setAttribute('data-lang', newLang);
  }, []);

  const toggleLang = useCallback(() => {
    const newLang = lang === 'en' ? 'bn' : 'en';
    setLang(newLang);
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}

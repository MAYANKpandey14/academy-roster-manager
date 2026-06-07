
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isHindi: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const LANG_KEY = 'academy-roster-lang-hindi';

  const [isHindi, setIsHindi] = useState(() => {
    try {
      return localStorage.getItem(LANG_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleLanguage = () => {
    setIsHindi(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LANG_KEY, String(next));
      } catch (e) {
        console.error('Failed to save language preference to localStorage:', e);
      }
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ isHindi, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

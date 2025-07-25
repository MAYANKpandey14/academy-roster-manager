
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isHindi: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isHindi, setIsHindi] = useState(false);

  const toggleLanguage = () => {
    setIsHindi(prev => !prev);
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

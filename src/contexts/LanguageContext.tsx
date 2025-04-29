
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'hi',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Always use Hindi language
  const currentLanguage = 'hi';
  
  return (
    <LanguageContext.Provider value={{ currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

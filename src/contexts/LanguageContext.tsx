
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage?: (lang: string) => void;
  isLoading?: boolean;
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
  // Add dummy changeLanguage function for backward compatibility
  const changeLanguage = () => {
    // No-op since we only support Hindi now
    console.info("Language switching is disabled. App always uses Hindi.");
  };
  
  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      isLoading: false 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

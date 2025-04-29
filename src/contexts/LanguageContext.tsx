
import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  // Add these properties to fix the type errors in the language switcher
  changeLanguage?: (lang: string) => void;
  isLoading?: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'hi',
  isLoading: false,
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Always use Hindi language - no switching functionality
  const currentLanguage = 'hi';
  const isLoading = false;
  
  // Add empty function to satisfy the type requirement
  const changeLanguage = (lang: string) => {
    // No-op since we're always using Hindi
    console.log("Language change not supported:", lang);
  };
  
  return (
    <LanguageContext.Provider value={{ 
      currentLanguage,
      changeLanguage,
      isLoading
    }}>
      {children}
    </LanguageContext.Provider>
  );
};


import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isHindi: boolean;
  toggleLanguage: () => void;
  isLoading: boolean;
  currentLanguage: string; // Added missing property
}

const LanguageContext = createContext<LanguageContextType>({
  isHindi: false,
  toggleLanguage: () => {},
  isLoading: false,
  currentLanguage: 'en', // Default value
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [isHindi, setIsHindi] = useState(localStorage.getItem('isHindi') === 'true');
  const [isLoading, setIsLoading] = useState(false);

  const toggleLanguage = () => {
    setIsLoading(true);
    
    // Update state
    const newValue = !isHindi;
    setIsHindi(newValue);
    
    // Save to localStorage
    localStorage.setItem('isHindi', String(newValue));
    
    // Apply a small timeout to simulate language change (for better UX)
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <LanguageContext.Provider value={{ 
      isHindi, 
      toggleLanguage, 
      isLoading,
      currentLanguage: isHindi ? 'hi' : 'en' // Provide the current language code
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

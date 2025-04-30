
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isHindi: boolean;
  toggleLanguage: () => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  isHindi: false,
  toggleLanguage: () => {},
  isLoading: false,
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
    <LanguageContext.Provider value={{ isHindi, toggleLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

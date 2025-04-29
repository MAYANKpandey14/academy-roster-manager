
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useEffect } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Apply or remove KrutiDev font class to body based on language
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
    
    // Force a repaint to ensure the language change is applied
    document.body.style.opacity = '0.99';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 10);
    
    // Dispatch a custom event that components can listen for
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
  };

  // Make sure language styling is applied on component mount
  useEffect(() => {
    if (i18n.language === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }
  }, [i18n.language]);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          variant={i18n.language === 'en' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('en')}
          className={`rounded-none px-2 md:px-3 py-1 h-8 md:h-9 text-sm ${
            i18n.language === 'en' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'
          }`}
        >
          En
        </Button>
        <Button
          variant={i18n.language === 'hi' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('hi')}
          className={`rounded-none px-2 md:px-3 py-1 h-8 md:h-9 text-sm ${
            i18n.language === 'hi' ? 'bg-blue-600 hover:bg-blue-700 krutidev-font' : 'bg-white text-gray-700'
          }`}
        >
          हि
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

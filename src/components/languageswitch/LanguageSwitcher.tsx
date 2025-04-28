
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = lang;
    
    // Set input language attribute for all inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.lang = lang;
        
        // For Hindi, set the input mode to allow Hindi typing
        if (lang === 'hi') {
          input.setAttribute('inputmode', 'text');
        } else {
          input.removeAttribute('inputmode');
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-gray-600" />
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          variant={i18n.language === 'en' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('en')}
          className={`rounded-none px-3 py-1 h-9 ${i18n.language === 'en' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'}`}
        >
          English
        </Button>
        <Button
          variant={i18n.language === 'hi' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('hi')}
          className={`rounded-none px-3 py-1 h-9 ${i18n.language === 'hi' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'}`}
        >
          हिंदी
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

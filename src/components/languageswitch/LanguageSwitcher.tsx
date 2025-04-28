
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
    
    // Change input language mode based on selected language
    document.documentElement.setAttribute('dir', lang === 'hi' ? 'ltr' : 'ltr');
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-gray-600" />
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          variant={i18n.language === 'en' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('en')}
          className={`rounded-none px-4 py-2 h-9 ${i18n.language === 'en' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'}`}
        >
          English
        </Button>
        <Button
          variant={i18n.language === 'hi' ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage('hi')}
          className={`rounded-none px-4 py-2 h-9 ${i18n.language === 'hi' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'}`}
        >
          हिंदी
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;

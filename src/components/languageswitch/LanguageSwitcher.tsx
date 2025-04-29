
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { changeLanguage, isLoading } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          variant={i18n.language === 'en' ? "default" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange('en')}
          disabled={isLoading}
          className={`rounded-none px-2 md:px-3 py-1 h-8 md:h-9 text-sm ${
            i18n.language === 'en' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'
          }`}
        >
          En
        </Button>
        <Button
          variant={i18n.language === 'hi' ? "default" : "outline"}
          size="sm"
          onClick={() => handleLanguageChange('hi')}
          disabled={isLoading}
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


import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <Button
        variant={i18n.language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('en')}
        className="px-3 py-1 h-8"
      >
        English
      </Button>
      <Button
        variant={i18n.language === 'hi' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('hi')}
        className="px-3 py-1 h-8"
      >
        हिंदी
      </Button>
    </div>
  );
};

export default LanguageSwitcher;

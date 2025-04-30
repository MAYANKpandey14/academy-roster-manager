
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { isHindi, toggleLanguage, isLoading } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
      <div className="flex rounded-md overflow-hidden border border-gray-200">
        <Button
          variant={!isHindi ? "default" : "outline"}
          size="sm"
          onClick={() => !isHindi ? null : toggleLanguage()}
          disabled={isLoading}
          className={`rounded-none px-2 md:px-3 py-1 h-8 md:h-9 text-sm transition-colors ${
            !isHindi ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700'
          }`}
        >
          En
        </Button>
        <Button
          variant={isHindi ? "default" : "outline"}
          size="sm"
          onClick={() => isHindi ? null : toggleLanguage()}
          disabled={isLoading}
          className={`rounded-none px-2 md:px-3 py-1 h-8 md:h-9 text-sm transition-colors ${
            isHindi ? 'bg-blue-600 hover:bg-blue-700 font-hindi' : 'bg-white text-gray-700'
          }`}
        >
          हि
        </Button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;


import { useEffect, useState } from "react";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigation } from "./Navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageswitch/LanguageSwitcher";

export function Header() {
  const [today, setToday] = useState<string>("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update date when language changes
    const updateDate = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setToday(date.toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', options));
    };
    
    updateDate();
    
    // Add listener for language changes
    const handleLanguageChange = () => {
      updateDate();
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success(t("logoutSuccess"));
    } catch (error) {
      toast.error(t("logoutError"));
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        {/* Logo and title area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-white p-1.5 rounded">
              <img src="/images.svg" alt="logo" className="w-[96px] h-[96px]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{t("headerTitle")}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
        
        {/* Navigation controls area */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">{today}</div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>{t("back")}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              <span>{t("home")}</span>
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t("logout")}</span>
            </Button>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  );
}

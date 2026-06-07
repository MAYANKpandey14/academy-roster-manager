
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";
import { useAttendanceAnomalies } from "@/hooks/useAttendanceAnomalies";

export function Navigation() {
  const location = useLocation();
  const { isHindi } = useLanguage();
  const { anomalies } = useAttendanceAnomalies();
  
  const routes = [
    { 
      name: isHindi ? "डैशबोर्ड" : "Dashboard", 
      path: "/dashboard" 
    },
    { 
      name: isHindi ? "प्रशिक्षु" : "Trainees", 
      path: "/trainees" 
    },
    { 
      name: isHindi ? "स्टाफ" : "Staff", 
      path: "/staff" 
    },
    { 
      name: isHindi ? "उपस्थिति" : "Attendance",
      path: "/attendance"
    },
    { 
      name: isHindi ? "आर्काइव" : "Archive",
      path: "/archive"
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
        <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4 overflow-x-auto">
          <div className="flex flex-wrap gap-4">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={location.pathname.startsWith(route.path) ? "default" : "ghost"}
              size="sm"
              asChild
              className={`whitespace-nowrap ${isHindi ? "font-mangal" : ""}`}
            >
              <Link to={route.path} className="flex items-center gap-1.5">
                {route.name}
                {route.path === "/dashboard" && anomalies.length > 0 && (
                  <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {anomalies.length}
                  </span>
                )}
              </Link>
            </Button>
          ))}
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <LanguageSwitcher />
        </div>
        </div>
      </div>
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navigation() {
  const location = useLocation();
  const { isHindi } = useLanguage();
  
  const routes = [
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
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-4 overflow-x-auto">
          {routes.map((route) => (
            <Button
              key={route.path}
              variant={location.pathname.startsWith(route.path) ? "default" : "ghost"}
              size="sm"
              asChild
              className={`whitespace-nowrap ${isHindi ? "font-mangal" : ""}`}
            >
              <Link to={route.path}>{route.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

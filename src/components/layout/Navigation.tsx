
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  UserX, 
  Archive,
  Home
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Navigation = () => {
  const location = useLocation();
  const { isHindi } = useLanguage();
  
  const navItems = [
    {
      href: "/trainees",
      icon: Home,
      label: isHindi ? "होम" : "Home",
      isActive: location.pathname === "/trainees"
    },
    {
      href: "/staff",
      icon: Users,
      label: isHindi ? "स्टाफ" : "Staff",
      isActive: location.pathname.startsWith("/staff")
    },
    {
      href: "/attendance",
      icon: Calendar,
      label: isHindi ? "उपस्थिति" : "Attendance",
      isActive: location.pathname === "/attendance"
    },
    {
      href: "/leave",
      icon: UserX,
      label: isHindi ? "छुट्टी" : "Leave",
      isActive: location.pathname === "/leave"
    },
    {
      href: "/archive",
      icon: Archive,
      label: isHindi ? "आर्काइव" : "Archive",
      isActive: location.pathname === "/archive"
    }
  ];

  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              item.isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              isHindi ? "font-hindi" : ""
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

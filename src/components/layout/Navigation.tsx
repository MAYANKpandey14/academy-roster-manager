import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle";
import { useLanguage } from '@/contexts/LanguageContext';
import { CalendarCheck, CalendarDays, Users, UserPlus, Settings, Archive, FileText, UserCog, Home, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isHindi } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [
    { 
      name: isHindi ? 'डैशबोर्ड' : 'Dashboard', 
      href: '/', 
      icon: Home 
    },
    { 
      name: isHindi ? 'स्टाफ रजिस्टर' : 'Staff Register', 
      href: '/staff-register', 
      icon: UserPlus 
    },
    { 
      name: isHindi ? 'प्रशिक्षु रजिस्टर' : 'Trainee Register', 
      href: '/trainee-register', 
      icon: GraduationCap 
    },
    { 
      name: isHindi ? 'स्टाफ' : 'Staff', 
      href: '/staff', 
      icon: Users 
    },
    { 
      name: isHindi ? 'प्रशिक्षु' : 'Trainees', 
      href: '/trainees', 
      icon: Users 
    },
    { 
      name: isHindi ? 'उपस्थिति प्रबंधन' : 'Attendance', 
      href: '/attendance', 
      icon: CalendarCheck 
    },
    { 
      name: isHindi ? 'व्यापक उपस्थिति' : 'Comprehensive Attendance', 
      href: '/comprehensive-attendance', 
      icon: CalendarDays 
    },
    { 
      name: isHindi ? 'पुरालेख' : 'Archive', 
      href: '/archive', 
      icon: Archive 
    },
    { 
      name: isHindi ? 'उपयोगकर्ता भूमिकाएँ' : 'User Roles', 
      href: '/user-roles', 
      icon: UserCog 
    },
    { 
      name: isHindi ? 'सेटिंग्स' : 'Settings', 
      href: '/settings', 
      icon: Settings 
    },
    { 
      name: isHindi ? 'लॉग' : 'Logs', 
      href: '/logs', 
      icon: FileText 
    },
  ];

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader>
          <SheetTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'नेविगेशन' : 'Navigation'}
          </SheetTitle>
          <SheetDescription className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'अपनी इच्छित कार्रवाई चुनें' : 'Choose what you want to do'}
          </SheetDescription>
        </SheetHeader>
        <nav className="grid gap-6">
          {navigationItems.map((item) => (
            <Link key={item.href} to={item.href} className="flex items-center space-x-2">
              {React.createElement(item.icon, { className: "h-4 w-4" })}
              <span className={isHindi ? 'font-hindi' : ''}>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 right-4">
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;

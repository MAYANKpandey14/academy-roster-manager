
import { useEffect, useState } from "react";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Header() {
  const [today, setToday] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Update date in Hindi format
    const updateDate = () => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setToday(date.toLocaleDateString('hi-IN', options));
    };
    
    updateDate();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("सफलतापूर्वक लॉग आउट कर दिया गया");
    } catch (error) {
      toast.error("लॉगआउट में समस्या");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2">
        {/* Logo and title area - improved responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex-shrink-0 mr-2">
              <img src="/images.svg" alt="logo" className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center md:text-left krutidev-heading">
              आरटीसी प्रशिक्षु प्रबंधन प्रणाली
            </h1>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-500 text-center krutidev-text">{today}</div>
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="hidden sm:flex"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="krutidev-text">वापस</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline krutidev-text">होम</span>
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline krutidev-text">लॉग आउट</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation buttons */}
      <div className="sm:hidden flex justify-center items-center gap-2 py-2 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
        >
          <Home className="h-4 w-4" />
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

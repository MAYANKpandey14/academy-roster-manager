
import { useEffect, useState } from "react";
import { ArrowLeft, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigation } from "./Navigation";

export function Header() {
  const [today, setToday] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    setToday(date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-white p-1.5 rounded">
              <img src="/images.svg" alt="logo" className="w-[96px] h-[96px]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">RTC TRAINING CENTRE POLICE LINE,MORADABAD</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-sm text-gray-500">{today}</div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="sm:w-auto"
              >
                <Home className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="sm:w-auto"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </header>
  );
}

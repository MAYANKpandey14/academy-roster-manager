
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = '/login.avif';
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (resetPassword) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        toast.success(isHindi ? "पासवर्ड रीसेट लिंक भेजा गया है" : "Password reset link sent");
        setResetPassword(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/welcome");
        toast.success(isHindi ? "सफलतापूर्वक लॉग इन हुआ" : "Successfully logged in");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center p-4 md:p-6"
      style={{
        backgroundImage: imageLoaded ? "url('/login.avif')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Language Switcher - Positioned on top for better visibility on all devices */}
      <div className="relative z-20 w-full flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      {/* Auth Form Container - Added better responsive positioning */}
      <div className="w-full max-w-md relative z-10 mt-10 sm:mt-20 animate-fade-in">
        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <img 
              src="/upp_logo.avif" 
              alt="Logo" 
              className="mx-auto h-20 w-20 md:h-28 md:w-28" 
            />
            <h2 className={`mt-6 text-2xl md:text-3xl font-bold text-gray-900 ${isHindi ? 'font-hindi' : ''}`}>
              {resetPassword 
                ? (isHindi ? "पासवर्ड रीसेट" : "Reset Password")
                : (isHindi ? "अपने अकाउंट में साइन इन करें" : "Sign In to Account")}
            </h2>
          </div>
          
          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            <div className="rounded-md space-y-4">
              <div>
                <Label htmlFor="email" className={`text-gray-900 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "ईमेल पता" : "Email Address"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isHindi ? "ईमेल पता दर्ज करें" : "Enter email address"}
                  className="bg-white/80 animate-scale-in"
                />
              </div>
              
              {!resetPassword && (
                <div>
                  <Label htmlFor="password" className={`text-gray-900 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? "पासवर्ड" : "Password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required={!resetPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isHindi ? "पासवर्ड दर्ज करें" : "Enter password"}
                    className="bg-white/80 animate-scale-in"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white animate-slide-in"
                disabled={loading}
              >
                <span className={isHindi ? 'font-hindi' : ''}>
                  {loading 
                    ? (isHindi ? "प्रक्रिया में..." : "Processing...") 
                    : resetPassword 
                      ? (isHindi ? "रीसेट लिंक भेजें" : "Send Reset Link") 
                      : (isHindi ? "साइन इन" : "Sign In")}
                </span>
              </Button>
              
              {!resetPassword ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(true)}
                  className="text-blue-600"
                >
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? "पासवर्ड भूल गए?" : "Forgot Password?"}
                  </span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(false)}
                  className="text-blue-600"
                >
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? "लॉगिन पर वापस जाएँ" : "Back to Login"}
                  </span>
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

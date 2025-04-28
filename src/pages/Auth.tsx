
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use the language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const img = new Image();
    img.src = '/login.jpeg';
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
        toast.success(t("passwordUpdated"));
        setResetPassword(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/welcome");
        toast.success(t("logoutSuccess"));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-6"
      style={{
        backgroundImage: imageLoaded ? "url('/login.jpeg')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Language Switcher - Now positioned relative to the container */}
      <div className="relative z-20 w-full flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      {/* Auth Form Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <img 
              src="/upp_logo.png" 
              alt="Logo" 
              className="mx-auto h-20 w-20 md:h-28 md:h-28" 
            />
            <h2 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">
              {resetPassword ? t("resetPassword") : t("signInToAccount")}
            </h2>
          </div>
          
          <form onSubmit={handleAuth} className="mt-8 space-y-6">
            <div className="rounded-md space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-900">
                  {t("emailAddress")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailAddress")}
                  className="bg-white/80"
                />
              </div>
              
              {!resetPassword && (
                <div>
                  <Label htmlFor="password" className="text-gray-900">
                    {t("password")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("password")}
                    className="bg-white/80"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? t("processing") : resetPassword 
                  ? t("sendResetLink") 
                  : t("signIn")}
              </Button>
              
              {!resetPassword ? (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(true)}
                  className="text-blue-600"
                >
                  {t("forgotPassword")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(false)}
                  className="text-blue-600"
                >
                  {t("backToLogin")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

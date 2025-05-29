
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { emailSchema } from "@/utils/inputValidation";
import { rateLimiter } from "@/utils/inputValidation";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = '/login.avif';
    img.onload = () => setImageLoaded(true);
  }, []);

  const cleanupAuthState = () => {
    // Clear all auth-related storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = `auth_${email}`;
    if (!rateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      toast.error(isHindi 
        ? "बहुत सारे असफल प्रयास। 15 मिनट बाद पुनः प्रयास करें।" 
        : "Too many failed attempts. Please try again in 15 minutes.");
      return;
    }

    // Validate email format
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      toast.error(isHindi ? "अवैध ईमेल प्रारूप" : "Invalid email format");
      return;
    }

    // Validate password strength for non-reset requests
    if (!resetPassword && password.length < 8) {
      toast.error(isHindi 
        ? "पासवर्ड कम से कम 8 अक्षर का होना चाहिए" 
        : "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    
    try {
      if (resetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        toast.success(isHindi ? "पासवर्ड रीसेट लिंक भेजा गया है" : "Password reset link sent");
        setResetPassword(false);
      } else {
        // Clean up any existing auth state
        cleanupAuthState();
        
        // Attempt global sign out first
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          // Continue even if this fails
          console.log('Global signout failed, continuing with login');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        
        if (error) {
          setLoginAttempts(prev => prev + 1);
          
          // Handle specific error types
          if (error.message.includes('Invalid login credentials')) {
            throw new Error(isHindi 
              ? "गलत ईमेल या पासवर्ड" 
              : "Invalid email or password");
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error(isHindi 
              ? "कृपया अपना ईमेल पुष्ट करें" 
              : "Please confirm your email address");
          } else if (error.message.includes('Too many requests')) {
            throw new Error(isHindi 
              ? "बहुत सारे अनुरोध। बाद में पुनः प्रयास करें।" 
              : "Too many requests. Please try again later.");
          }
          
          throw error;
        }
        
        if (data.user) {
          toast.success(isHindi ? "सफलतापूर्वक लॉग इन हुआ" : "Successfully logged in");
          
          // Force page reload for clean state
          setTimeout(() => {
            window.location.href = "/welcome";
          }, 100);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Sanitize error message for display
      const errorMessage = error.message || (isHindi 
        ? "लॉगिन में त्रुटि हुई" 
        : "An error occurred during login");
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Lock account after too many failed attempts
  if (loginAttempts >= 5) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <h2 className={`text-2xl font-bold text-red-600 mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "खाता लॉक हो गया" : "Account Locked"}
          </h2>
          <p className={`text-gray-600 mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi 
              ? "बहुत सारे असफल प्रयासों के कारण आपका खाता अस्थायी रूप से लॉक हो गया है।" 
              : "Your account has been temporarily locked due to too many failed login attempts."}
          </p>
          <Button 
            onClick={() => {
              setLoginAttempts(0);
              setResetPassword(true);
            }}
            className="w-full"
          >
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "पासवर्ड रीसेट करें" : "Reset Password"}
            </span>
          </Button>
        </div>
      </div>
    );
  }

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
      
      {/* Language Switcher */}
      <div className="relative z-20 w-full flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      {/* Auth Form Container */}
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
                  onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                  placeholder={isHindi ? "ईमेल पता दर्ज करें" : "Enter email address"}
                  className="bg-white/80 animate-scale-in"
                  autoComplete="email"
                  maxLength={254}
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
                    autoComplete="current-password"
                    minLength={8}
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

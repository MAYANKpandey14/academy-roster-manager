
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const img = new Image();
  img.src = '/login.jpeg';
  img.onload = () => setImageLoaded(true);

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (resetPassword) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        toast.success("Password reset email sent!");
        setResetPassword(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/welcome");
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: imageLoaded ? "url('/login.jpeg')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <img src="/upp_logo.png" alt="Logo" className="mx-auto h-28 w-28" />
            <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-gray-900">
              {resetPassword ? "Reset Password" : "Sign in to your account"}
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="rounded-md space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-900">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="bg-white/80"
                />
              </div>
              
              {!resetPassword && (
                <div>
                  <Label htmlFor="password" className="text-gray-900">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
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
                {loading ? "Processing..." : resetPassword 
                  ? "Send reset link" 
                  : "Sign in"}
              </Button>
              
              {!resetPassword && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(true)}
                  className="text-blue-600"
                >
                  Forgot your password?
                </Button>
              )}
              
              {resetPassword && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setResetPassword(false)}
                  className="text-blue-600"
                >
                  Back to login
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


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
        navigate("/");
        toast.success("Logged in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
      {/* Background image with responsive sizing */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/848121d1-4a54-4879-bd4e-2d7e21c26244.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <img 
              src="/lovable-uploads/848121d1-4a54-4879-bd4e-2d7e21c26244.png" 
              alt="Police Academy Logo" 
              className="mx-auto h-24 w-auto object-contain"
            />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {resetPassword ? "Reset Password" : "Sign in to your account"}
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full"
                />
              </div>
              
              {!resetPassword && (
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                disabled={loading}
              >
                {loading ? "Processing..." : resetPassword 
                  ? "Send reset link" 
                  : "Sign in"}
              </Button>
              
              <div className="text-center">
                {!resetPassword ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setResetPassword(true)}
                    className="text-blue-600 text-sm"
                  >
                    Forgot your password?
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setResetPassword(false)}
                    className="text-blue-600 text-sm"
                  >
                    Back to login
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

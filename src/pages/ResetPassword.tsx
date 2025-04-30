
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isHindi } = useLanguage();

  // Create schema based on current language
  const formSchema = z.object({
    password: z.string().min(6, isHindi ? "पासवर्ड कम से कम 6 अक्षर लंबा होना चाहिए" : "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: isHindi ? "पासवर्ड मेल नहीं खाते" : "Passwords do not match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success(isHindi ? "पासवर्ड सफलतापूर्वक अपडेट किया गया" : "Password updated successfully");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Language Switcher - Positioned consistently with Auth page */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div>
          <img src="/images.svg" alt="Logo" className="mx-auto h-24 w-24" />
          <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "अपना पासवर्ड रीसेट करें" : "Reset Your Password"}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-scale-in">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? "नया पासवर्ड" : "New Password"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className={isHindi ? 'font-hindi' : ''} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className={isHindi ? 'font-hindi' : ''} />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full animate-slide-in" disabled={loading}>
              <span className={isHindi ? 'font-hindi' : ''}>
                {loading 
                  ? (isHindi ? "प्रक्रिया में..." : "Processing...") 
                  : (isHindi ? "पासवर्ड अपडेट करें" : "Update Password")}
              </span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

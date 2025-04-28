
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import LanguageSwitcher from "@/components/languageswitch/LanguageSwitcher";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Use the language inputs hook
  useLanguageInputs();

  const formSchema = z.object({
    password: z.string().min(6, t("passwordUpdated")),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("passwordUpdated"),
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Set input language based on selected language
  useEffect(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.lang = i18n.language;
      }
    });
  }, [i18n.language]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success(t("passwordUpdated"));
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
      
      <div className="w-full max-w-md space-y-8">
        <div>
          <img src="/images.svg" alt="Logo" className="mx-auto h-24 w-24" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t("resetYourPassword")}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newPassword")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      lang={i18n.language} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      lang={i18n.language} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("processing") : t("updatePassword")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

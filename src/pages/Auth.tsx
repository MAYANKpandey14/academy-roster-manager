
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/hooks/useUser";

const authFormSchema = z.object({
  email: z.string().email({
    message: "ईमेल अमान्य है",
  }),
  password: z.string().min(6, {
    message: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
  }),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { user } = useUser();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof authFormSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(values);
        if (error) throw error;
        
        toast.success("सफलतापूर्वक लॉग इन किया गया");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp(values);
        if (error) throw error;
        
        toast.success("खाता सफलतापूर्वक बनाया गया। आपका ईमेल सत्यापित करें।");
        setMode("signin");
      }
    } catch (e: any) {
      setError(e.message);
      console.error("Auth error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img className="mx-auto h-20 w-20" src="/images.svg" alt="Logo" />
          <h1 className="mt-6 text-3xl font-bold krutidev-heading">
            आरटीसी प्रशिक्षु प्रबंधन प्रणाली
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="krutidev-heading">
              {mode === "signin" ? "लॉग इन" : "रजिस्टर"}
            </CardTitle>
            <CardDescription className="krutidev-text">
              {mode === "signin" 
                ? "अपने खाते में लॉग इन करें" 
                : "एक नया खाता बनाएं"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue={mode} 
              onValueChange={(value) => setMode(value as "signin" | "signup")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" className="krutidev-text">लॉग इन</TabsTrigger>
                <TabsTrigger value="signup" className="krutidev-text">रजिस्टर</TabsTrigger>
              </TabsList>
              
              <TabsContent value={mode}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription className="krutidev-text">{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="krutidev-text">ईमेल</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="example@email.com" 
                              {...field} 
                              className="auth-input"
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage className="krutidev-text" />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="krutidev-text">पासवर्ड</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              className="auth-input"
                              autoComplete={mode === "signin" ? "current-password" : "new-password"}
                            />
                          </FormControl>
                          <FormMessage className="krutidev-text" />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      <span className="krutidev-text">
                        {isLoading ? "प्रोसेसिंग..." : mode === "signin" ? "लॉग इन करें" : "रजिस्टर करें"}
                      </span>
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => navigate("/reset-password")} 
              className="krutidev-text"
            >
              पासवर्ड भूल गए?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

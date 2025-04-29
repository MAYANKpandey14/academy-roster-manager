
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
      const { email, password } = values;
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("सफलतापूर्वक लॉग इन किया गया");
      navigate("/");
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
          <h1 className="mt-6 text-3xl font-bold">
            आरटीसी प्रशिक्षु प्रबंधन प्रणाली
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              लॉग इन
            </CardTitle>
            <CardDescription>
              अपने खाते में लॉग इन करें
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ईमेल</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="example@email.com" 
                          {...field} 
                          className="auth-input"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>पासवर्ड</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          className="auth-input"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  <span>
                    {isLoading ? "प्रोसेसिंग..." : "लॉग इन करें"}
                  </span>
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => navigate("/reset-password")} 
            >
              पासवर्ड भूल गए?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

// Form schema definition
const registerFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's name is required" }),
  mobile_number: z.string().min(10, { message: "Valid mobile number is required" }),
  home_address: z.string().min(1, { message: "Home address is required" })
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function TraineeRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Initialize form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      pno: "",
      name: "",
      father_name: "",
      mobile_number: "",
      home_address: ""
    }
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true);
    setSubmissionStatus({});
    
    try {
      console.log("Submitting trainee registration:", data);
      
      const response = await supabase.functions.invoke('trainee-register', {
        body: data
      });

      if (response.error) {
        console.error("Registration error:", response.error);
        throw new Error(response.error.message || "Failed to register");
      }

      console.log("Registration successful:", response.data);
      
      // Reset form and show success message
      form.reset();
      setSubmissionStatus({ 
        success: true,
        message: "THANK YOU, you may close this page"
      });
    } catch (error) {
      console.error("Error during registration:", error);
      
      // Handle duplicate PNO error
      const errorMessage = error.message?.includes("already exists") 
        ? "A trainee with this PNO already exists" 
        : "Registration failed. Please try again.";
      
      setSubmissionStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trainee Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please fill in your details below
          </p>
        </div>

        {submissionStatus.success ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-700 font-medium">{submissionStatus.message}</p>
            </div>
          </div>
        ) : submissionStatus.message ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-700 font-medium">{submissionStatus.message}</p>
            </div>
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required="true">PNO / Unique ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your PNO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required="true">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="father_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required="true">Father's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your father's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required="true">Mobile Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Enter your mobile number" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="home_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-required="true">Full Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your complete home address" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertTriangle } from "lucide-react";
import { ImageUpload } from "@/components/common/ImageUpload";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups, traineeRanks } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

// Form schema definition
const registerFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  chest_no: z.string().min(1, { message: "Chest number is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's name is required" }),
  rank: z.string().optional(),
  category_caste: z.string().min(1, { message: "Category/Caste is required" }),
  toli_no: z.string().optional(),
  mobile_number: z.string().min(10, { message: "Valid mobile number is required" }),
  current_posting_district: z.string().min(1, { message: "Current posting district is required" }),
  education: z.string().min(1, { message: "Education is required" }),
  date_of_birth: z.string().min(1, { message: "Date of birth is required" }),
  date_of_joining: z.string().min(1, { message: "Date of joining is required" }),
  arrival_date: z.string().min(1, { message: "Arrival date is required" }),
  departure_date: z.string().min(1, { message: "Departure date is required" }),
  blood_group: z.string().min(1, { message: "Blood group is required" }),
  nominee: z.string().min(1, { message: "Nominee is required" }),
  home_address: z.string().min(1, { message: "Home address is required" }),
  photo_url: z.string().min(1),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function TraineeRegister() {
  const { isHindi } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Initialize form with default values
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      pno: "",
      chest_no: "",
      name: "",
      father_name: "",
      rank: "CONST",
      toli_no: "",
      mobile_number: "",
      current_posting_district: "",
      education: "",
      date_of_birth: new Date().toISOString().split('T')[0],
      date_of_joining: new Date().toISOString().split('T')[0],
      arrival_date: new Date().toISOString().split('T')[0],
      departure_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      blood_group: "",
      nominee: "",
      home_address: "",
      photo_url: "",
    }
  });

  const handleImageUpload = (url: string | null) => {
    setImageUrl(url);
    form.setValue("photo_url", url || "");
  };

  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true);
    setSubmissionStatus({});
    
    try {
      console.log("Submitting trainee registration:", data);
      
      const response = await supabase.functions.invoke('trainee-register', {
        body: data
      });

      // Check if there's an error in the response
      if (response.error) {
        console.error("Registration error:", response.error);
        // Extract the actual error message from the response
        const errorMessage = response.error.message || "Failed to register";
        setSubmissionStatus({
          success: false,
          message: errorMessage
        });
        return;
      }

      // Check if the response data contains an error (for 4xx status codes)
      if (response.data && response.data.error) {
        console.error("API error:", response.data);
        setSubmissionStatus({
          success: false,
          message: response.data.error
        });
        return;
      }

      console.log("Registration successful:", response.data);
      
      // Reset form and show success message
      form.reset();
      setImageUrl(null);
      setSubmissionStatus({ 
        success: true,
        message: "THANK YOU, you may close this page"
      });
    } catch (error: any) {
      console.error("Error during registration:", error);
      
      setSubmissionStatus({
        success: false,
        message: error.message || "Registration failed. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Info Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Service Information</h3>
                
                <FormField
                  control={form.control}
                  name="pno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">PNO</FormLabel>
                      <FormControl>
                        <Input maxLength={9} placeholder="Enter your PNO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chest_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Chest Number</FormLabel>
                      <FormControl>
                        <Input maxLength={4} placeholder="Enter your chest number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Rank</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {traineeRanks.map((rank) => (
                            <SelectItem key={rank} value={rank}>
                              {rank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toli_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toli No.</FormLabel>
                      <FormControl>
                        <Input maxLength={3} placeholder="Enter toli number (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_posting_district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Current Posting District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your current posting district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Education</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your education" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                
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
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_caste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isHindi ? 'font-hindi' : ''}>
                        {isHindi ? "श्रेणी/जाति" : "Category/Caste"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage className={isHindi ? 'font-hindi' : ''} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_joining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Date of Joining</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nominee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Nominee</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter nominee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Training Period Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Training Period</h3>
                
                <FormField
                  control={form.control}
                  name="arrival_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Arrival Date RTC</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departure_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Departure Date after Training</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ImageUpload 
                  bucketName="trainee_photos"
                  onImageUpload={handleImageUpload}
                  label="Profile Photo (Compulsory)"
                />
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                
                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel aria-required="true">Mobile Number</FormLabel>
                      <FormControl>
                        <Input 
                          maxLength={10}
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
              </div>
            </div>

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

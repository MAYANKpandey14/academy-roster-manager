import { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertTriangle, Upload } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups, staffRanks } from "@/components/staff/StaffFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

// Form schema definition
const registerFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's name is required" }),
  rank: z.string().min(1, { message: "Rank is required" }),
  category_caste: z.string().required(),
  current_posting_district: z.string().min(1, { message: "Current posting district is required" }),
  mobile_number: z.string().min(10, { message: "Valid mobile number is required" }),
  education: z.string().min(1, { message: "Education is required" }),
  date_of_birth: z.string().min(1, { message: "Date of birth is required" }),
  date_of_joining: z.string().min(1, { message: "Date of joining is required" }),
  arrival_date: z.string().min(1, { message: "Arrival date is required" }),
  blood_group: z.string().min(1, { message: "Blood group is required" }),
  nominee: z.string().min(1, { message: "Nominee is required" }),
  home_address: z.string().min(1, { message: "Home address is required" }),
  toli_no: z.string().optional(),
  class_no: z.string().optional(),
  class_subject: z.string().optional(),
  photo_url: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function StaffRegister() {
  const { isHindi } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
    details?: string;
  }>({});

  // Initialize form with default values
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      pno: "",
      name: "",
      father_name: "",
      rank: "",
      toli_no: "",
      mobile_number: "",
      current_posting_district: "",
      education: "",
      date_of_birth: new Date().toISOString().split('T')[0],
      date_of_joining: new Date().toISOString().split('T')[0],
      arrival_date: new Date().toISOString().split('T')[0],
      blood_group: "",
      nominee: "",
      home_address: "",
      class_no: "",
      class_subject: "",
      photo_url: "",
    }
  });

  // Handle image upload with better error handling
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    console.log("Starting file upload for:", file.name);
    
    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setSubmissionStatus({
        success: false,
        message: "Only JPG, PNG, and WEBP images are accepted"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmissionStatus({
        success: false,
        message: "Image must be smaller than 5MB"
      });
      return;
    }

    setIsUploading(true);
    setSubmissionStatus({});
    
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.name.split('.').pop()}`;
      console.log("Uploading file with name:", fileName);
      
      // Upload the file to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('staff_photos')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('staff_photos')
        .getPublicUrl(fileName);
      
      const url = publicUrlData.publicUrl;
      console.log("Image uploaded successfully:", url);
      setImageUrl(url);
      form.setValue("photo_url", url);
      
      setSubmissionStatus({
        success: true,
        message: "Photo uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setSubmissionStatus({
        success: false,
        message: "Error uploading image",
        details: error.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: RegisterFormValues) {
    console.log("Starting staff registration submission:", data);
    setIsSubmitting(true);
    setSubmissionStatus({});
    
    try {
      // Use Supabase Functions invoke instead of direct fetch
      const { data: responseData, error } = await supabase.functions.invoke('staff-register', {
        body: data,
      });

      console.log("Edge function response:", { responseData, error });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to register staff");
      }

      console.log("Registration successful:", responseData);
      
      // Reset form and show success message
      form.reset();
      setImageUrl(null);
      setSubmissionStatus({ 
        success: true,
        message: "THANK YOU, you may close this page"
      });
    } catch (error: any) {
      console.error("Error during registration:", error);
      
      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";
      let errorDetails = error.message;
      
      if (error.message?.includes("already exists")) {
        errorMessage = "A staff with this PNO already exists";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message?.includes("401") || error.message?.includes("unauthorized")) {
        errorMessage = "Authentication error. Please refresh the page and try again.";
      }
      
      setSubmissionStatus({
        success: false,
        message: errorMessage,
        details: errorDetails
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Staff Registration</h2>
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
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">{submissionStatus.message}</p>
                {submissionStatus.details && (
                  <p className="text-red-600 text-sm mt-1">Details: {submissionStatus.details}</p>
                )}
              </div>
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
                          {staffRanks.map((rank) => (
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
                        <Input placeholder="Enter toli number (optional)" {...field} />
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

              {/* Additional Fields Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Additional Information</h3>
                
                <FormField
                  control={form.control}
                  name="class_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class No (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter class number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class_subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Subject (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter class subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Photo Upload */}
                <div className="space-y-2">
                  <FormLabel>Profile Photo</FormLabel>
                  <div className="flex flex-col space-y-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full relative overflow-hidden" 
                      disabled={isUploading}
                    >
                      <span className="mr-2">
                        {isUploading ? "Uploading..." : "Choose Photo"}
                      </span>
                      <Upload className="h-4 w-4" />
                      <Input 
                        type="file" 
                        accept="image/jpeg,image/jpg,image/png,image/webp" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange} 
                        disabled={isUploading}
                      />
                    </Button>
                    
                    {imageUrl && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded-md overflow-hidden border">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-muted-foreground">Photo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
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
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

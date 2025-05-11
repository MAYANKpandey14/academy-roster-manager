
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { bloodGroups, staffRanks } from '@/components/staff/StaffFormSchema';
import { ImageUpload } from '@/components/common/ImageUpload';

// Create a schema for form validation
const staffRegisterSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  rank: z.string().min(1, "Rank is required"),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().min(1, "Date of Birth is required"),
  date_of_joining: z.string().min(1, "Date of Joining is required"),
  blood_group: z.string().min(1, "Blood Group is required"),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
  toli_no: z.string().optional(),
  class_no: z.string().optional(),
  class_subject: z.string().optional(),
  photo_url: z.string().optional(),
});

type StaffRegisterFormValues = z.infer<typeof staffRegisterSchema>;

const StaffRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isHindi } = useLanguage();

  const form = useForm<StaffRegisterFormValues>({
    resolver: zodResolver(staffRegisterSchema),
    defaultValues: {
      pno: "",
      name: "",
      father_name: "",
      rank: "",
      current_posting_district: "",
      mobile_number: "",
      education: "",
      date_of_birth: "",
      date_of_joining: "",
      blood_group: "",
      nominee: "",
      home_address: "",
      toli_no: "",
      class_no: "",
      class_subject: "",
      photo_url: "",
    },
  });

  const handleImageUpload = (url: string | null) => {
    form.setValue("photo_url", url || '');
  };

  const handleSubmit = async (data: StaffRegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Call the staff-register edge function
      const response = await fetch('https://zjgphamebgrclivvkhmw.supabase.co/functions/v1/staff-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register staff');
      }

      // Show success message
      toast.success(isHindi ? 'आपका पंजीकरण सफल रहा' : 'Your registration was successful');
      setIsSuccess(true);
      form.reset();
    } catch (error: any) {
      // Show error message
      console.error('Registration error:', error);
      toast.error(error.message || (isHindi ? 'पंजीकरण विफल हुआ' : 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'स्टाफ पंजीकरण फॉर्म' : 'Staff Registration Form'}
            </CardTitle>
            <CardDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? 'कृपया अपना विवरण भरें। सभी आवश्यक फ़ील्ड (*) भरें।'
                : 'Please fill in your details. All fields marked with (*) are required.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center py-8">
                <h3 className={`text-xl font-medium text-green-600 mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'पंजीकरण सफल!' : 'Registration Successful!'}
                </h3>
                <p className={isHindi ? 'font-hindi' : ''}>
                  {isHindi
                    ? 'आपका विवरण सफलतापूर्वक जमा कर दिया गया है।'
                    : 'Your details have been successfully submitted.'}
                </p>
                <Button 
                  className="mt-6" 
                  onClick={() => {
                    setIsSuccess(false);
                    form.reset();
                  }}
                >
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'नया पंजीकरण करें' : 'Register Another'}
                  </span>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "पीएनओ/यूनिक आईडी *" : "PNO/Unique ID *"}
                          </FormLabel>
                          <FormControl>
                            <Input maxLength={12} {...field} />
                          </FormControl>
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "नाम *" : "Name *"}
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
                      name="father_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "पिता का नाम *" : "Father's Name *"}
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
                      name="rank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "रैंक *" : "Rank *"}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
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
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="current_posting_district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "वर्तमान पोस्टिंग जिला *" : "Current Posting District *"}
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
                      name="mobile_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "मोबाइल नंबर *" : "Mobile Number *"}
                          </FormLabel>
                          <FormControl>
                            <Input maxLength={11} {...field} type="tel" />
                          </FormControl>
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "शिक्षा *" : "Education *"}
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
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "जन्म तिथि *" : "Date of Birth *"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
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
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "भर्ती तिथि *" : "Date of Joining *"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="blood_group"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "रक्त समूह *" : "Blood Group *"}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isHindi ? "रक्त समूह चुनें" : "Select blood group"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group} >
                                  {group}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nominee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "नॉमिनी *" : "Nominee *"}
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
                      name="home_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "घर का पता *" : "Home Address *"}
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
                      name="toli_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "टोली नंबर (वैकल्पिक)" : "Toli No (Optional)"}
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
                      name="class_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "क्लास नंबर (वैकल्पिक)" : "Class No (Optional)"}
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
                      name="class_subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isHindi ? 'font-hindi' : ''}>
                            {isHindi ? "क्लास विषय (वैकल्पिक)" : "Class Subject (Optional)"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage className={isHindi ? 'font-hindi' : ''} />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
                    <ImageUpload 
                      bucketName="staff_photos"
                      onImageUpload={handleImageUpload}
                      label={isHindi ? 'स्टाफ फोटो (वैकल्पिक)' : 'Staff Photo (Optional)'}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    <span className={isHindi ? 'font-hindi' : ''}>
                      {isSubmitting 
                        ? (isHindi ? "पंजीकरण हो रहा है..." : "Registering...") 
                        : (isHindi ? "पंजीकरण करें" : "Register")
                      }
                    </span>
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffRegister;

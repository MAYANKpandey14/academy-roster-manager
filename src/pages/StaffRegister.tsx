
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffFormSchema } from '@/components/staff/StaffFormSchema';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/common/ImageUpload';
import { PersonalInfoFields } from '@/components/staff/form/PersonalInfoFields';
import { ServiceInfoFields } from '@/components/staff/form/ServiceInfoFields';
import { ContactInfoFields } from '@/components/staff/form/ContactInfoFields';
import { StaffFormValues } from '@/components/staff/StaffFormSchema';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

const StaffRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isHindi } = useLanguage();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      pno: "",
      name: "",
      father_name: "",
      rank: undefined,
      current_posting_district: "",
      mobile_number: "",
      education: "",
      date_of_birth: "",
      date_of_joining: "",
      blood_group: undefined,
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

  const handleSubmit = async (data: StaffFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting staff data:', data);

      // Call the staff-register edge function
      const response = await fetch('https://zjgphamebgrclivvkhmw.supabase.co/functions/v1/staff-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register staff');
      }

      const result = await response.json();

      console.log('Registration success:', result);
      toast.success(isHindi ? 'आपका पंजीकरण सफल रहा' : 'Your registration was successful');
      setIsSuccess(true);
      form.reset();
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || (isHindi ? 'पंजीकरण विफल हुआ' : 'Registration failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="border-t-4 border-t-blue-500 shadow-md">
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
                  }}
                >
                  <span className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'नया पंजीकरण करें' : 'Register Another'}
                  </span>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'सेवा विवरण' : 'Service Information'}
                    </h3>
                    <Separator className="mb-4" />
                    <ServiceInfoFields isHindi={isHindi} />
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'व्यक्तिगत विवरण' : 'Personal Information'}
                    </h3>
                    <Separator className="mb-4" />
                    <PersonalInfoFields isHindi={isHindi} />
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'संपर्क विवरण' : 'Contact Information'}
                    </h3>
                    <Separator className="mb-4" />
                    <ContactInfoFields isHindi={isHindi} />
                  </div>

                  <div className="mt-6">
                    <h3 className={`text-lg font-medium mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'फोटो अपलोड' : 'Photo Upload'}
                    </h3>
                    <Separator className="mb-4" />
                    <ImageUpload 
                      bucketName="staff_photos"
                      onImageUpload={handleImageUpload}
                      label={isHindi ? 'स्टाफ फोटो (वैकल्पिक)' : 'Staff Photo (Optional)'}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full"
                  >
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

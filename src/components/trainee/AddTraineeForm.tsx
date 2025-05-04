
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { traineeFormSchema, TraineeFormValues } from "./TraineeFormSchema";
import { toast } from "sonner";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ServiceInfoFields } from "./form/ServiceInfoFields";
import { DateFields } from "./form/DateFields";
import { ContactFields } from "./form/ContactFields";
import { useNavigate } from "react-router-dom";
import { addTrainee } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageUpload } from "@/components/common/ImageUpload";

interface AddTraineeFormProps {
  onSuccess?: () => void;
}

export function AddTraineeForm({ onSuccess }: AddTraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {isHindi} = useLanguage();
  
  // Apply language inputs hook for form fields
  useLanguageInputs();

  const form = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeFormSchema),
    defaultValues: {
      photo_url: "", // Initialize photo_url
    },
  });

  const onSubmit = async (data: TraineeFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      console.log("Form data to submit:", data);
      
      // The form now contains properly formatted dates from the DateFields component,
      // so we don't need to transform them here
      const formData = {
        ...data,
        photo_url: data.photo_url || null // Ensure photo_url is null if not provided
      };
      
      console.log("Transformed form data:", formData);

      // Call the API to add a new trainee
      const response = await addTrainee(formData);
      
      if (response.error) {
        console.error("API returned error:", response.error);
        throw response.error;
      }
      
      console.log("API response:", response);
      toast.success(isHindi ? "प्रशिक्षानिवेशी सफलतापूर्वक जोड़ा गया है" : "Trainee added successfully");
      
      if (onSuccess) {
        onSuccess();
      }
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : isHindi ? "प्रशिक्षानिवेशी डेटा सफलतापूर्वक सहेजने में विफल हो गया है। कृपया फिर से प्रयास करें।" : "Failed to save trainee data. Please try again.";
      
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    console.log("Image URL set in form:", url);
    form.setValue("photo_url", url);
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 dynamic-text">{isHindi ? "प्रशिक्षु जोड़ें" : "Add New Trainee"}</h2>
      
      {formError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dynamic-text">{formError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceInfoFields form={form} />
              <PersonalInfoFields form={form} />
              <DateFields form={form} />
              <ContactFields form={form} />
              
              <div className="col-span-1 md:col-span-2">
                <ImageUpload 
                  bucketName="trainee_photos"
                  onImageUpload={handleImageUpload}
                  label={isHindi ? 'प्रशिक्षु फोटो' : 'Trainee Photo'}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                <span className="dynamic-text">{isHindi ? "रद्द करें" : "Cancel"}</span>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <span className="dynamic-text">
                  {isSubmitting 
                    ? isHindi ? "सहेजने में..." : "Saving..."
                    : isHindi ? "जोड़ें" : "Add Trainee"}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}


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
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

interface AddTraineeFormProps {
  onSuccess?: () => void;
}

export function AddTraineeForm({ onSuccess }: AddTraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Apply language inputs hook for form fields
  useLanguageInputs();

  const form = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: TraineeFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      console.log("Form data to submit:", data);
      
      const formData = {
        ...data,
        arrival_date: new Date(data.arrival_date).toISOString(),
        departure_date: new Date(data.departure_date).toISOString(),
        date_of_birth: new Date(data.date_of_birth).toISOString(),
        date_of_joining: new Date(data.date_of_joining).toISOString(),
      };
      
      console.log("Transformed form data:", formData);

      // Call the API to add a new trainee
      const response = await addTrainee(formData);
      
      if (response.error) {
        console.error("API returned error:", response.error);
        throw response.error;
      }
      
      console.log("API response:", response);
      toast.success(t("traineeAdded", "Trainee added successfully"));
      
      if (onSuccess) {
        onSuccess();
      }
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : t("failedToSaveTrainee", "Failed to save trainee data. Please try again.");
      
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 dynamic-text">{t("addNewTrainee", "Add New Trainee")}</h2>
      
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
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                <span className="dynamic-text">{t("cancel", "Cancel")}</span>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <span className="dynamic-text">
                  {isSubmitting 
                    ? t("saving", "Saving...") 
                    : t("addTrainee", "Add Trainee")}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

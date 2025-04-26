
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { traineeFormSchema, TraineeFormValues } from "./TraineeFormSchema";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ServiceInfoFields } from "./form/ServiceInfoFields";
import { DateFields } from "./form/DateFields";
import { ContactFields } from "./form/ContactFields";
import { useNavigate } from "react-router-dom";
import { updateTrainee } from "@/services/api";

interface EditTraineeFormProps {
  trainee: Trainee;
  onSuccess?: () => void;
}

export function EditTraineeForm({ trainee, onSuccess }: EditTraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Format dates for form input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date: ${dateString}`);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return '';
    }
  };

  const defaultValues: Partial<TraineeFormValues> = {
    pno: trainee.pno,
    chest_no: trainee.chest_no,
    name: trainee.name,
    father_name: trainee.father_name,
    arrival_date: formatDateForInput(trainee.arrival_date),
    departure_date: formatDateForInput(trainee.departure_date),
    current_posting_district: trainee.current_posting_district,
    mobile_number: trainee.mobile_number,
    education: trainee.education,
    date_of_birth: formatDateForInput(trainee.date_of_birth),
    date_of_joining: formatDateForInput(trainee.date_of_joining),
    blood_group: trainee.blood_group,
    nominee: trainee.nominee,
    home_address: trainee.home_address,
  };

  console.log("Default form values:", defaultValues);

  const form = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TraineeFormValues) => {
    setIsSubmitting(true);
    console.log("Form data to submit:", data);
    
    try {
      // Ensure all dates are valid
      const validateDate = (dateString: string): string => {
        if (!dateString) throw new Error("Missing date value");
        const date = new Date(dateString);
        if (isNaN(date.getTime())) throw new Error(`Invalid date: ${dateString}`);
        return dateString; // Return original string if valid
      };
      
      // Validate all date fields
      const formData = {
        ...data,
        arrival_date: validateDate(data.arrival_date),
        departure_date: validateDate(data.departure_date),
        date_of_birth: validateDate(data.date_of_birth),
        date_of_joining: validateDate(data.date_of_joining),
      };
      
      console.log("Transformed form data:", formData);

      // Call the API to update the trainee
      const response = await updateTrainee(trainee.id, formData);
      
      if (response.error) {
        throw response.error;
      }
      
      toast.success("Trainee updated successfully");
      
      if (onSuccess) {
        onSuccess();
      }
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update trainee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Edit Trainee</h2>
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
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Update Trainee"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

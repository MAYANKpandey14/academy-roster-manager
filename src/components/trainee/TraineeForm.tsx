
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

interface TraineeFormProps {
  trainee?: Trainee;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export function TraineeForm({ trainee, onSuccess, onCancel, isEditMode }: TraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<TraineeFormValues> = trainee
    ? {
        ...trainee,
        arrival_date: trainee.arrival_date ? trainee.arrival_date.split('T')[0] : '',
        departure_date: trainee.departure_date ? trainee.departure_date.split('T')[0] : '',
        date_of_birth: trainee.date_of_birth ? trainee.date_of_birth.split('T')[0] : '',
        date_of_joining: trainee.date_of_joining ? trainee.date_of_joining.split('T')[0] : '',
      }
    : {};

  const form = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TraineeFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = {
        ...data,
        arrival_date: new Date(data.arrival_date).toISOString(),
        departure_date: new Date(data.departure_date).toISOString(),
        date_of_birth: new Date(data.date_of_birth).toISOString(),
        date_of_joining: new Date(data.date_of_joining).toISOString(),
      };

      console.log("Form data to be sent:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditMode ? "Trainee updated successfully" : "Trainee added successfully");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save trainee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceInfoFields form={form} />
        <PersonalInfoFields form={form} />
        <DateFields form={form} />
        <ContactFields form={form} />
      </div>

      {isEditMode && (
        <div className="sticky bottom-0 flex justify-end space-x-4 pt-6 mt-6 border-t bg-white">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update Trainee" : "Add Trainee"}
          </Button>
        </div>
      )}

      {!isEditMode && (
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Trainee"}
          </Button>
        </div>
      )}
    </div>
  );

  // Different wrapper for edit mode vs add mode
  if (!isEditMode) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Add New Trainee</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {formContent}
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {formContent}
      </form>
    </Form>
  );
}


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

interface EditTraineeFormProps {
  trainee: Trainee;
  onSuccess?: () => void;
}

export function EditTraineeForm({ trainee, onSuccess }: EditTraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const defaultValues: Partial<TraineeFormValues> = {
    ...trainee,
    arrival_date: trainee.arrival_date ? trainee.arrival_date.split('T')[0] : '',
    departure_date: trainee.departure_date ? trainee.departure_date.split('T')[0] : '',
    date_of_birth: trainee.date_of_birth ? trainee.date_of_birth.split('T')[0] : '',
    date_of_joining: trainee.date_of_joining ? trainee.date_of_joining.split('T')[0] : '',
  };

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
      
      toast.success("Trainee updated successfully");
      
      if (onSuccess) {
        onSuccess();
      }
      navigate('/');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update trainee data");
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

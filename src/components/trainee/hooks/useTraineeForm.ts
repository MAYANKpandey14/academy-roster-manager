
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TraineeFormValues, traineeFormSchema } from "../TraineeFormSchema";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";

interface UseTraineeFormProps {
  trainee?: Trainee;
  onSuccess?: (trainee: Trainee) => void;
  onCancel?: () => void;
}

export function useTraineeForm({ trainee, onSuccess, onCancel }: UseTraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!trainee;

  const defaultValues: Partial<TraineeFormValues> = trainee
    ? {
        ...trainee,
        arrival_date: trainee.arrival_date ? new Date(trainee.arrival_date) : undefined,
        departure_date: trainee.departure_date ? new Date(trainee.departure_date) : undefined,
        date_of_birth: trainee.date_of_birth ? new Date(trainee.date_of_birth) : undefined,
        date_of_joining: trainee.date_of_joining ? new Date(trainee.date_of_joining) : undefined,
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
        pno: data.pno,
        chest_no: data.chest_no,
        name: data.name,
        father_name: data.father_name,
        arrival_date: data.arrival_date.toISOString(),
        departure_date: data.departure_date.toISOString(),
        date_of_birth: data.date_of_birth.toISOString(),
        date_of_joining: data.date_of_joining.toISOString(),
        current_posting_district: data.current_posting_district,
        mobile_number: data.mobile_number,
        education: data.education,
        blood_group: data.blood_group,
        nominee: data.nominee,
        home_address: data.home_address,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTrainee: Trainee = {
        ...formData,
        id: isEditMode ? trainee!.id : `${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      toast.success(isEditMode ? "Trainee updated successfully" : "Trainee added successfully");
      
      if (onSuccess) {
        onSuccess(newTrainee);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save trainee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isEditMode,
    onSubmit,
    onCancel
  };
}


import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { ContactFields } from "./form-sections/ContactFields";
import { ServiceFields } from "./form-sections/ServiceFields";
import { DateFields } from "./form-sections/DateFields";
import { AdditionalFields } from "./form-sections/AdditionalFields";
import { useTraineeForm } from "./hooks/useTraineeForm";
import { Trainee } from "@/types/trainee";

interface TraineeFormProps {
  trainee?: Trainee;
  onSuccess?: (trainee: Trainee) => void;
  onCancel?: () => void;
}

export function TraineeForm({ trainee, onSuccess, onCancel }: TraineeFormProps) {
  const { form, isSubmitting, isEditMode, onSubmit } = useTraineeForm({
    trainee,
    onSuccess,
    onCancel
  });

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>
          {isEditMode ? "Edit Trainee" : "Add New Trainee"}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceFields form={form} />
            <PersonalInfoFields form={form} />
            <DateFields form={form} />
            <AdditionalFields form={form} />
            <ContactFields form={form} />
          </div>

          <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-white py-4 border-t mt-6">
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
        </form>
      </Form>
    </div>
  );
}

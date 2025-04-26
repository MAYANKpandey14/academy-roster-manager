
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      <DialogHeader className="px-6 py-4 border-b">
        <DialogTitle>
          {isEditMode ? "Edit Trainee" : "Add New Trainee"}
        </DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              <ServiceFields form={form} />
              <PersonalInfoFields form={form} />
              <DateFields form={form} />
              <AdditionalFields form={form} />
              <div className="md:col-span-2">
                <ContactFields form={form} />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-4 px-6 py-4 border-t bg-background">
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

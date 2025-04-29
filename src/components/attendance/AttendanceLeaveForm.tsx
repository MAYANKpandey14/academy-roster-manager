
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

import { StatusField, LeaveTypeField } from "./components/StatusField";
import { DateFields } from "./components/DateFields";
import { ReasonField } from "./components/ReasonField";
import { attendanceFormSchema, AttendanceFormValues } from "./schema";
import { useAttendanceSubmit } from "./hooks/useAttendanceSubmit";
import { AttendanceLeaveFormProps } from "./types";

export function AttendanceLeaveForm({ type, personId, onSuccess }: AttendanceLeaveFormProps) {
  const { i18n } = useTranslation();
  const { handleSubmit: submitForm, isSubmitting } = useAttendanceSubmit(type, personId, onSuccess);
  
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      status: 'absent',
      start_date: new Date(),
      end_date: new Date(),
      reason: '',
    },
  });
  
  const watchStatus = form.watch('status');
  
  const onSubmit = async (values: AttendanceFormValues) => {
    const success = await submitForm(values);
    if (success) {
      form.reset();
    }
  };

  // If no person selected yet, show a message
  if (!personId) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-muted-foreground">कृपया अनुपस्थिति या अवकाश दर्ज करने के लिए पहले किसी व्यक्ति को खोजें।</p>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">अनुपस्थिति / अवकाश दर्ज करें</h2>
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatusField />
              
              {watchStatus === 'on_leave' && (
                <LeaveTypeField />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateFields />
            </div>

            <ReasonField />

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full md:w-auto"
            >
              {isSubmitting ? 'जमा हो रहा है...' : 'जमा करें'}
            </Button>
          </form>
        </Form>
      </FormProvider>
    </Card>
  );
}

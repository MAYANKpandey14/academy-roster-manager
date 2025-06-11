
import { useWatch } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Form,
} from "@/components/ui/form";
import { FormStatusField } from "./form/FormStatusField";
import { FormLeaveTypeField } from "./form/FormLeaveTypeField";
import { FormDateFields } from "./form/FormDateFields";
import { FormReasonField } from "./form/FormReasonField";
import { FormSubmitButton } from "./form/FormSubmitButton";
import { useAttendanceSubmit, attendanceFormSchema, type AttendanceFormValues } from "./form/useAttendanceSubmit";

interface AttendanceFormProps {
  personType: 'trainee' | 'staff';
  personId: string;
  pno: string;
  onSuccess: () => void;
}

export function AttendanceForm({ personType, personId, pno, onSuccess }: AttendanceFormProps) {
  const { isHindi } = useLanguage();
  const queryClient = useQueryClient();
  
  // Setup form with default values
  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      status: "absent",
      leaveType: undefined,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: undefined,
      reason: "",
      customStatus: "",
    },
  });
  
  const watchStatus = useWatch({ control: form.control, name: "status" });
  
  const handleSuccessWithRefresh = () => {
    // Invalidate queries to refresh attendance data immediately
    queryClient.invalidateQueries({ queryKey: ["attendance", personId, personType] });
    onSuccess();
  };
  
  const { isSubmitting, handleSubmit } = useAttendanceSubmit({ 
    personType, 
    personId, 
    onSuccess: handleSuccessWithRefresh 
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormStatusField />
            
            {watchStatus === "on_leave" && <FormLeaveTypeField />}
          </div>

          <FormDateFields />

          <FormReasonField />
          
          <FormSubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </FormProvider>
  );
}

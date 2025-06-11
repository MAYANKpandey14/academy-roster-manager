
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const attendanceFormSchema = z.object({
  status: z.enum(["absent", "duty", "training", "on_leave", "return_to_unit", "suspension", "resignation", "termination", "other"]),
  customStatus: z.string().optional(),
  leaveType: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

interface UseAttendanceSubmitProps {
  personType: 'trainee' | 'staff';
  personId: string;
  onSuccess: () => void;
}

export function useAttendanceSubmit({ personType, personId, onSuccess }: UseAttendanceSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isHindi } = useLanguage();

  const handleSubmit = async (data: AttendanceFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting attendance data:", data);
      
      // Use custom status if "other" is selected
      const finalStatus = data.status === "other" ? data.customStatus || "other" : data.status;
      
      const functionName = personType === 'trainee' ? 'trainee-attendance-add' : 'staff-attendance-add';
      
      const requestData = {
        [`${personType}Id`]: personId,
        status: finalStatus,
        date: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        leaveType: data.leaveType
      };
      
      console.log("Calling function:", functionName, "with data:", requestData);
      
      const { data: result, error } = await supabase.functions.invoke(functionName, {
        body: requestData
      });
      
      if (error) {
        console.error("Function error:", error);
        throw error;
      }
      
      console.log("Function result:", result);
      
      toast.success(isHindi ? 
        'उपस्थिति/छुट्टी सफलतापूर्वक दर्ज की गई' : 
        'Attendance/Leave recorded successfully'
      );
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(isHindi ? 
        'उपस्थिति/छुट्टी दर्ज करने में विफल' : 
        'Failed to record attendance/leave'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}

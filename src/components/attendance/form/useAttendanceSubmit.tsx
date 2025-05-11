
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface UseAttendanceSubmitProps {
  personType: 'trainee' | 'staff';
  personId: string;
  onSuccess: () => void;
}

// Form schema
export const attendanceFormSchema = z.object({
  status: z.enum(["absent", "on_leave", "suspension", "resignation", "termination"]),
  leaveType: z.string().optional(),
  startDate: z.string({
    required_error: "Start date is required",
  }),
  endDate: z.string().optional(),
  reason: z.string().min(3, {
    message: "Reason must be at least 3 characters",
  }),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

export function useAttendanceSubmit({ personType, personId, onSuccess }: UseAttendanceSubmitProps) {
  const { isHindi } = useLanguage();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: AttendanceFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No active session found for attendance submission");
        toast.error(isHindi 
          ? "सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें" 
          : "Session expired. Please log in again");
        setIsSubmitting(false);
        return;
      }
      
      // Prepare the request data
      const requestData = {
        ...(personType === 'trainee' ? { traineeId: personId } : { staffId: personId }),
        status: values.status,
        date: values.startDate,
        endDate: values.endDate || values.startDate,
        reason: values.reason,
        leaveType: values.leaveType
      };
      
      // Call the appropriate edge function based on person type
      const functionName = personType === 'trainee' ? 'trainee-attendance-add' : 'staff-attendance-add';
      
      console.log(`Submitting ${personType} attendance/leave data:`, requestData);
      console.log(`Using function: ${functionName}`);
      console.log(`Auth token available:`, !!session.access_token);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestData,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) {
        console.error(`Error from ${functionName} function:`, error);
        throw error;
      }
      
      console.log(`${personType} attendance/leave record added:`, data);
      
      toast.success(isHindi 
        ? "रिकॉर्ड सफलतापूर्वक जोड़ा गया" 
        : "Record added successfully");
        
      // Invalidate both attendance and leave queries for this person
      queryClient.invalidateQueries({ queryKey: ['absences', personId] });
      queryClient.invalidateQueries({ queryKey: ['leaves', personId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', personId] });
      
      onSuccess();
      
    } catch (error) {
      console.error("Error submitting record:", error);
      toast.error(isHindi 
        ? "रिकॉर्ड जोड़ने में त्रुटि" 
        : "Error adding record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}

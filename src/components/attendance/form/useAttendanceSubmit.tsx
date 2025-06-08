
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

// Form schema with better validation
export const attendanceFormSchema = z.object({
  status: z.enum(["absent", "duty", "training", "on_leave", "return_to_unit", "suspension", "resignation", "termination"]),
  leaveType: z.string().optional(),
  startDate: z.string({
    required_error: "Start date is required",
  }),
  endDate: z.string().optional(),
  reason: z.string().min(3, {
    message: "Reason must be at least 3 characters",
  }),
}).refine(data => {
  // If end date is provided, it should be on or after start date
  if (data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be on or after start date",
  path: ["endDate"],
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
      
      // Determine if auto-approval applies based on status
      const requiresApproval = ['on_leave', 'resignation'].includes(values.status);
      // duty, training, return_to_unit, absent, suspension, termination are auto-approved
      console.log(`Status: ${values.status}, Requires Approval: ${requiresApproval}`);
      console.log(`Reason provided: ${values.reason}`); // Debug log
      
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
      
      // Show different messages based on whether the request requires approval
      if (requiresApproval) {
        toast.success(isHindi 
          ? "अनुरोध सफलतापूर्वक जमा किया गया और अनुमोदन के लिए लंबित है" 
          : "Request submitted successfully and pending approval");
      } else {
        toast.success(isHindi 
          ? "रिकॉर्ड सफलतापूर्वक जोड़ा गया और स्वचालित रूप से अनुमोदित किया गया" 
          : "Record added successfully and automatically approved");
      }
        
      // Invalidate all relevant queries to refresh the data
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = Array.isArray(query.queryKey) ? query.queryKey[0] : null;
          return ['absences', 'leaves', 'attendance'].includes(String(key));
        }
      });
      
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

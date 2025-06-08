
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";

export const attendanceFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
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
  const queryClient = useQueryClient();

  const handleSubmit = async (values: AttendanceFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { status, leaveType, startDate, endDate, reason } = values;
      
      // Determine approval status - duty and training are auto-approved
      const approvalStatus = ['duty', 'training'].includes(status) ? 'approved' : 'pending';
      
      // Format the status with reason for certain types
      let formattedStatus = status;
      if (['duty', 'training'].includes(status) && reason) {
        formattedStatus = `${status}: ${reason}`;
      }

      if (status === "on_leave" && leaveType && startDate && endDate) {
        // Submit leave record
        const leaveTable = personType === "staff" ? "staff_leave" : "trainee_leave";
        const idColumn = personType === "staff" ? "staff_id" : "trainee_id";
        
        const { error: leaveError } = await supabase
          .from(leaveTable)
          .insert({
            [idColumn]: personId,
            start_date: startDate,
            end_date: endDate,
            reason,
            leave_type: leaveType,
            status: "pending"
          });

        if (leaveError) {
          throw leaveError;
        }

        toast.success(
          isHindi 
            ? "छुट्टी आवेदन सफलतापूर्वक जमा किया गया" 
            : "Leave application submitted successfully"
        );
      } else {
        // Submit attendance record
        const attendanceTable = personType === "staff" ? "staff_attendance" : "trainee_attendance";
        const idColumn = personType === "staff" ? "staff_id" : "trainee_id";
        
        const { error: attendanceError } = await supabase
          .from(attendanceTable)
          .insert({
            [idColumn]: personId,
            date: startDate,
            status: formattedStatus,
            approval_status: approvalStatus
          });

        if (attendanceError) {
          throw attendanceError;
        }

        const statusMessage = ['duty', 'training'].includes(status) 
          ? (isHindi ? "रिकॉर्ड सफलतापूर्वक जमा और अनुमोदित किया गया" : "Record submitted and approved successfully")
          : (isHindi ? "उपस्थिति रिकॉर्ड सफलतापूर्वक जमा किया गया" : "Attendance record submitted successfully");
        
        toast.success(statusMessage);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance", personId, personType] });
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(
        isHindi 
          ? "रिकॉर्ड जमा करने में त्रुटि हुई" 
          : "Error submitting record"
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


import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAttendanceService } from "@/hooks/useAttendanceService";
import { PersonType } from "@/types/attendance";

interface UseAttendanceSubmitProps {
  personType: PersonType;
  personId: string;
  onSuccess: () => void;
}

// Form schema with better validation
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
  const { 
    isLoading: isSubmitting,
    submitAttendance,
    submitLeave
  } = useAttendanceService({ onSuccess });
  
  const handleSubmit = async (values: AttendanceFormValues) => {
    const { status, startDate, endDate, reason, leaveType } = values;
    
    try {
      // Determine if we need to record leave or absence
      if (status === 'on_leave') {
        // For leave, we need both start and end date
        const result = await submitLeave(
          personId,
          personType,
          startDate,
          endDate || startDate, // Use start date as end date if not provided
          reason,
          leaveType
        );
        
        return result;
      } else {
        // For other absences, we only need the start date
        const result = await submitAttendance(
          personId,
          personType,
          startDate,
          status,
          reason
        );
        
        return result;
      }
    } catch (error) {
      console.error("Error in attendance submission:", error);
      toast.error(isHindi 
        ? "रिकॉर्ड जोड़ने में त्रुटि"
        : "Error adding record");
      return false;
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}

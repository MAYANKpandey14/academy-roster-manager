
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  AttendancePersonType 
} from "@/services/attendance/types";
import { 
  submitAbsenceRecord, 
  submitLeaveRecord 
} from "@/services/attendance/attendance-service";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseAttendanceSubmissionProps {
  personType: AttendancePersonType;
  personId: string;
  onSuccess?: () => void;
}

export function useAttendanceSubmission({
  personType,
  personId,
  onSuccess
}: UseAttendanceSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isHindi } = useLanguage();
  const queryClient = useQueryClient();
  
  const submitAbsenceMutation = useMutation({
    mutationFn: async ({
      date,
      status,
      reason
    }: {
      date: string;
      status: string;
      reason: string;
    }) => {
      return submitAbsenceRecord(personId, personType, date, status, reason);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['attendance', personId, personType] });
      toast.success(isHindi ? "अनुपस्थिति रिकॉर्ड जमा किया गया" : "Absence record submitted");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error('Error submitting absence:', error);
      toast.error(isHindi ? "अनुपस्थिति रिकॉर्ड जमा करने में विफल" : "Failed to submit absence");
    }
  });
  
  const submitLeaveMutation = useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      reason,
      leaveType
    }: {
      startDate: string;
      endDate: string;
      reason: string;
      leaveType?: string;
    }) => {
      return submitLeaveRecord(personId, personType, startDate, endDate, reason, leaveType);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['attendance', personId, personType] });
      toast.success(isHindi ? "अवकाश अनुरोध जमा किया गया" : "Leave request submitted");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error('Error submitting leave:', error);
      toast.error(isHindi ? "अवकाश अनुरोध जमा करने में विफल" : "Failed to submit leave request");
    }
  });

  // Combined submission handler for both absence and leave
  const handleSubmit = async ({
    status,
    startDate,
    endDate = '',
    reason,
    leaveType
  }: {
    status: string;
    startDate: string;
    endDate?: string;
    reason: string;
    leaveType?: string;
  }) => {
    try {
      setIsSubmitting(true);
      
      // For leave, we need both start and end date
      if (status === 'on_leave') {
        await submitLeaveMutation.mutateAsync({
          startDate,
          endDate: endDate || startDate, // Use start date as end date if not provided
          reason,
          leaveType
        });
      } else {
        // For other absences, we only need the start date
        await submitAbsenceMutation.mutateAsync({
          date: startDate,
          status,
          reason
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error in attendance submission:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting: isSubmitting || submitAbsenceMutation.isPending || submitLeaveMutation.isPending,
    submitAttendance: submitAbsenceMutation.mutate,
    submitLeave: submitLeaveMutation.mutate,
    handleSubmit
  };
}

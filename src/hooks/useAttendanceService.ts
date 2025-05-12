
import { useState } from "react";
import { useAttendanceSubmission } from "./useAttendanceSubmission";
import { PersonType } from "@/types/attendance";
import { AttendancePersonType } from "@/services/attendance/types";
import { updateApprovalStatus } from "@/services/attendance/attendance-service";

interface UseAttendanceServiceProps {
  onSuccess?: () => void;
}

export function useAttendanceService({ onSuccess }: UseAttendanceServiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Submit attendance record (absence)
  const submitAttendance = async (
    personId: string,
    personType: PersonType,
    date: string,
    status: string,
    reason: string
  ) => {
    try {
      setIsLoading(true);
      
      // Convert PersonType to AttendancePersonType
      const mappedPersonType: AttendancePersonType = personType;
      
      // Create a submission hook instance
      const { handleSubmit } = useAttendanceSubmission({
        personType: mappedPersonType,
        personId,
        onSuccess
      });
      
      // Submit the record
      const result = await handleSubmit({
        status,
        startDate: date,
        reason,
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit leave record
  const submitLeave = async (
    personId: string,
    personType: PersonType,
    startDate: string,
    endDate: string,
    reason: string,
    leaveType?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Convert PersonType to AttendancePersonType
      const mappedPersonType: AttendancePersonType = personType;
      
      // Create a submission hook instance
      const { handleSubmit } = useAttendanceSubmission({
        personType: mappedPersonType,
        personId,
        onSuccess
      });
      
      // Submit the leave request
      const result = await handleSubmit({
        status: 'on_leave',
        startDate,
        endDate,
        reason,
        leaveType
      });
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Update approval status
  const handleUpdateApprovalStatus = async (
    recordId: string,
    recordType: 'absence' | 'leave',
    personType: PersonType,
    approvalStatus: 'approved' | 'pending' | 'rejected'
  ) => {
    try {
      setIsLoading(true);
      // Convert PersonType to AttendancePersonType
      const mappedPersonType: AttendancePersonType = personType;
      
      const result = await updateApprovalStatus(
        recordId,
        recordType,
        mappedPersonType,
        approvalStatus
      );
      
      if (result.success && onSuccess) {
        onSuccess();
      }
      
      return result.success;
    } catch (error) {
      console.error("Error updating approval status:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    submitAttendance,
    submitLeave,
    updateApprovalStatus: handleUpdateApprovalStatus
  };
}


import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceRequest, AttendanceService } from "@/services/attendanceService";
import { ApprovalStatus, AttendanceStatus, PersonType } from "@/types/attendance";

interface UseAttendanceServiceOptions {
  onSuccess?: () => void;
}

export function useAttendanceService(options?: UseAttendanceServiceOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { isHindi } = useLanguage();
  const { onSuccess } = options || {};

  // Submit attendance or absence
  const submitAttendance = async (
    personId: string, 
    personType: PersonType,
    date: string,
    status: AttendanceStatus,
    reason: string
  ) => {
    setIsLoading(true);
    
    try {
      await AttendanceService.submitAttendance({
        personId,
        personType,
        date,
        status,
        reason
      });
      
      toast.success(isHindi 
        ? "उपस्थिति रिकॉर्ड सफलतापूर्वक जोड़ा गया"
        : "Attendance record added successfully");
        
      // Invalidate relevant queries
      invalidateQueries();
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error(isHindi 
        ? "उपस्थिति रिकॉर्ड जोड़ने में त्रुटि"
        : "Error adding attendance record");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit leave request
  const submitLeave = async (
    personId: string,
    personType: PersonType,
    startDate: string,
    endDate: string,
    reason: string,
    leaveType?: string
  ) => {
    setIsLoading(true);
    
    try {
      await AttendanceService.submitLeave({
        personId,
        personType,
        date: startDate,
        endDate,
        reason,
        leaveType
      });
      
      toast.success(isHindi 
        ? "छुट्टी अनुरोध सफलतापूर्वक जमा किया गया"
        : "Leave request submitted successfully");
        
      // Invalidate relevant queries
      invalidateQueries();
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error(isHindi 
        ? "छुट्टी अनुरोध जमा करने में त्रुटि"
        : "Error submitting leave request");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update approval status
  const updateApprovalStatus = async (
    recordId: string,
    recordType: 'absence' | 'leave',
    personType: PersonType,
    approvalStatus: ApprovalStatus
  ) => {
    setIsLoading(true);
    
    try {
      await AttendanceService.updateApprovalStatus({
        recordId,
        recordType,
        personType,
        approvalStatus
      });
      
      toast.success(isHindi 
        ? approvalStatus === 'approved' 
          ? "अनुरोध स्वीकृत किया गया"
          : "अनुरोध अस्वीकृत किया गया"
        : approvalStatus === 'approved'
          ? "Request approved successfully"
          : "Request rejected successfully");
          
      // Invalidate relevant queries
      invalidateQueries();
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error("Error updating approval status:", error);
      toast.error(isHindi 
        ? "अनुरोध स्थिति अपडेट करने में त्रुटि"
        : "Error updating request status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to invalidate all relevant queries
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ 
      predicate: (query) => {
        const key = Array.isArray(query.queryKey) ? query.queryKey[0] : null;
        return [
          'attendance', 
          'absences', 
          'leaves', 
          'staff_attendance', 
          'trainee_attendance'
        ].includes(String(key));
      }
    });
  };
  
  return {
    isLoading,
    submitAttendance,
    submitLeave,
    updateApprovalStatus
  };
}

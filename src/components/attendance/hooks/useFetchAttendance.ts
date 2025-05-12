
import { useAttendanceRecords } from "@/hooks/useAttendanceRecords";
import { PersonType } from "@/types/attendance";
import { AttendancePersonType } from "@/services/attendance/types";

/**
 * Legacy hook for backwards compatibility
 * This maintains the existing API while using the new implementation
 */
export const useFetchAttendance = (
  userId?: string, 
  personType: PersonType = 'trainee', 
  startDate?: string, 
  endDate?: string
) => {
  // Convert PersonType to AttendancePersonType
  const mappedPersonType: AttendancePersonType = personType;

  // Use the new modular hook
  const { 
    data: records, 
    isLoading,
    error
  } = useAttendanceRecords({ 
    personId: userId,
    personType: mappedPersonType,
    startDate,
    endDate
  });

  return {
    attendanceData: {}, // This wasn't used directly in components anyway
    leaveData: [], // This wasn't used directly in components anyway
    isLoading,
    error: error ? error.message : null,
    data: records || []
  };
};


import { useQuery } from "@tanstack/react-query";
import { 
  AttendanceFetchParams, 
  AttendanceRecord 
} from "@/types/attendance-records";
import { fetchAttendanceRecords } from "@/services/attendance/attendance-service";

/**
 * React Query hook for fetching attendance records
 */
export const useAttendanceRecords = (params: Omit<AttendanceFetchParams, 'personId'> & { personId?: string }) => {
  const { personId, personType = 'trainee', startDate, endDate, limit } = params;
  
  return useQuery<AttendanceRecord[], Error>({
    queryKey: ['attendance', personId, personType, startDate, endDate],
    enabled: !!personId,
    queryFn: async () => {
      if (!personId) return [];
      
      return fetchAttendanceRecords({
        personId,
        personType,
        startDate,
        endDate,
        limit
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

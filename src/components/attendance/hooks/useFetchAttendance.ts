
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason?: string;
  approval_status: string;
  person_id: string;
  start_date?: string;
  end_date?: string;
  leave_type?: string;
}

export interface PersonInfo {
  id: string;
  pno: string;
  name: string;
  father_name?: string;
}

export function useFetchAttendance(personId: string, personType: 'trainee' | 'staff') {
  return useQuery({
    queryKey: ['attendance', personId, personType],
    queryFn: async (): Promise<AttendanceRecord[]> => {
      if (!personId) return [];

      try {
        const tableName = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
        const leaveTableName = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
        
        // Fetch attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from(tableName)
          .select('*')
          .eq(`${personType}_id`, personId)
          .order('date', { ascending: false });

        if (attendanceError) throw attendanceError;

        // Fetch leave records  
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTableName)
          .select('*')
          .eq(`${personType}_id`, personId)
          .order('start_date', { ascending: false });

        if (leaveError) throw leaveError;

        // Process attendance records
        const processedAttendance: AttendanceRecord[] = [];
        
        if (attendanceData) {
          attendanceData.forEach((record: any) => {
            processedAttendance.push({
              id: record.id,
              date: record.date,
              status: record.status || 'absent',
              reason: record.reason,
              approval_status: record.approval_status || 'pending',
              person_id: record[`${personType}_id`] || personId
            });
          });
        }

        // Process leave records
        if (leaveData) {
          leaveData.forEach((record: any) => {
            processedAttendance.push({
              id: record.id,
              date: record.start_date,
              status: 'on_leave',
              reason: record.reason,
              approval_status: record.approval_status || record.status || 'pending',
              person_id: record[`${personType}_id`] || personId,
              start_date: record.start_date,
              end_date: record.end_date,
              leave_type: record.leave_type
            });
          });
        }

        // Sort by date (most recent first)
        processedAttendance.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        return processedAttendance;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }
    },
    enabled: !!personId,
  });
}

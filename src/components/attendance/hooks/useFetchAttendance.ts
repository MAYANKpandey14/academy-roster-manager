
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  trainee_id?: string;
  staff_id?: string;
  reason?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  approval_status: string;
  trainee_id?: string;
  staff_id?: string;
  leave_type?: string;
}

export interface PersonInfo {
  id: string;
  pno: string;
  name: string;
  father_name?: string;
}

export interface FetchAttendanceResponse {
  attendance: AttendanceRecord[];
  leave: LeaveRecord[];
}

async function fetchAttendance(personId: string, personType: 'trainee' | 'staff'): Promise<FetchAttendanceResponse> {
  if (!personId) {
    return { attendance: [], leave: [] };
  }

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

    // Process attendance records with status and reason parsing
    const processedAttendance: AttendanceRecord[] = (attendanceData || []).map((record: any) => {
      let actualStatus = record.status;
      let reason = undefined;
      
      // Parse status if it contains a reason (format: "status: reason")
      if (record.status && record.status.includes(": ")) {
        const parts = record.status.split(": ");
        actualStatus = parts[0];
        reason = parts.slice(1).join(": ");
      }

      const baseRecord = {
        id: record.id,
        date: record.date,
        status: actualStatus || 'absent',
        approval_status: record.approval_status || 'pending',
        reason: reason
      };

      // Add the appropriate ID field
      if (personType === 'trainee') {
        return { ...baseRecord, trainee_id: personId };
      } else {
        return { ...baseRecord, staff_id: personId };
      }
    });

    // Process leave records
    const processedLeave: LeaveRecord[] = (leaveData || []).map((record: any) => {
      const baseRecord = {
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        status: record.status || 'pending',
        reason: record.reason,
        approval_status: record.status || 'pending',
        leave_type: record.leave_type
      };

      // Add the appropriate ID field
      if (personType === 'trainee') {
        return { ...baseRecord, trainee_id: personId };
      } else {
        return { ...baseRecord, staff_id: personId };
      }
    });

    // Sort
    processedAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    processedLeave.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

    return {
      attendance: processedAttendance,
      leave: processedLeave
    };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
}

export function useFetchAttendance(personId: string, personType: 'trainee' | 'staff') {
  return useQuery({
    queryKey: ['attendance', personId, personType],
    queryFn: () => fetchAttendance(personId, personType),
    enabled: !!personId,
  });
}

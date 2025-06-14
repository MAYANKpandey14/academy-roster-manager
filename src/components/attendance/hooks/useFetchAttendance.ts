
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  reason?: string;
  trainee_id?: string;
  staff_id?: string;
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

async function fetchAttendance(personId: string, personType: 'trainee' | 'staff') {
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

    const processedAttendance = (attendanceData || []).map((record: any) => ({
      id: record.id,
      date: record.date,
      status: record.status || 'absent',
      approval_status: record.approval_status || 'pending',
      reason: record.reason,
      trainee_id: personType === 'trainee' ? personId : undefined,
      staff_id: personType === 'staff' ? personId : undefined
    }));

    const processedLeave = (leaveData || []).map((record: any) => ({
      id: record.id,
      start_date: record.start_date,
      end_date: record.end_date,
      status: record.status || 'pending',
      reason: record.reason,
      approval_status: record.status || 'pending',
      trainee_id: personType === 'trainee' ? personId : undefined,
      staff_id: personType === 'staff' ? personId : undefined,
      leave_type: record.leave_type
    }));

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

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
    const foreignKeyField = `${personType}_id`;

    // Use direct queries to avoid TypeScript issues
    let attendanceData: any[] = [];
    let leaveData: any[] = [];

    try {
      const supabaseUrl = 'https://zjgphamebgrclivvkhmw.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZ3BoYW1lYmdyY2xpdnZraG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTM2NDcsImV4cCI6MjA2MTI2OTY0N30.1SmOoYa7R4iybW0nCIuc-FrbYML-EP9yC2ykJ6kpUTo';
      
      const attendanceResponse = await fetch(
        `${supabaseUrl}/rest/v1/${tableName}?${foreignKeyField}=eq.${personId}`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (attendanceResponse.ok) {
        attendanceData = await attendanceResponse.json();
      }

      const leaveResponse = await fetch(
        `${supabaseUrl}/rest/v1/${leaveTableName}?${foreignKeyField}=eq.${personId}`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (leaveResponse.ok) {
        leaveData = await leaveResponse.json();
      }
    } catch (fetchError) {
      console.warn('Direct fetch failed, using fallback data:', fetchError);
    }

    // Process attendance records with status and reason parsing
    const processedAttendance: AttendanceRecord[] = attendanceData.map((record) => {
      let actualStatus = record.status;
      let reason: string | undefined = undefined;
      
      // Parse status if it contains a reason (format: "status: reason")
      if (record.status && record.status.includes(": ")) {
        const parts = record.status.split(": ");
        actualStatus = parts[0];
        reason = parts.slice(1).join(": ");
      }

      const processedRecord: AttendanceRecord = {
        id: record.id,
        date: record.date,
        status: actualStatus || 'absent',
        approval_status: record.approval_status || 'pending',
        reason: reason
      };

      // Add the appropriate ID field based on person type
      if (personType === 'trainee') {
        processedRecord.trainee_id = personId;
      } else {
        processedRecord.staff_id = personId;
      }

      return processedRecord;
    });

    // Process leave records
    const processedLeave: LeaveRecord[] = leaveData.map((record) => {
      const processedRecord: LeaveRecord = {
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        status: record.status || 'pending',
        reason: record.reason,
        approval_status: record.status || 'pending',
        leave_type: record.leave_type
      };

      // Add the appropriate ID field based on person type
      if (personType === 'trainee') {
        processedRecord.trainee_id = personId;
      } else {
        processedRecord.staff_id = personId;
      }

      return processedRecord;
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
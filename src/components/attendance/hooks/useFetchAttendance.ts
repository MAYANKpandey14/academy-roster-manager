
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parse } from "date-fns";
import { convertToDateString } from "@/utils/export";

export interface AttendanceRecord {
  date: string;
  status: string;
  approval_status: string;
  type: 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination';
  reason: string;
  duration?: string;
}

type Attendance = {
  [date: string]: {
    status: string;
    approval_status: string;
    reason?: string;
  }
};

type LeaveRecord = {
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  leave_type?: string;
};

export const useFetchAttendance = (userId?: string, isTrainee = false, startDate?: string, endDate?: string) => {
  const [attendanceData, setAttendanceData] = useState<Attendance>({});
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAttendance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine which table to query based on the isTrainee flag
        const tableName = isTrainee ? 'trainee_attendance' : 'staff_attendance';
        const idColumn = isTrainee ? 'trainee_id' : 'staff_id';
        
        let query = supabase.from(tableName).select('*').eq(idColumn, userId);
        
        if (startDate && endDate) {
          query = query.gte('date', startDate).lte('date', endDate);
        }
        
        const { data: attendanceRecords, error: attendanceError } = await query;
        
        if (attendanceError) throw attendanceError;
        
        // Format attendance data
        const formattedAttendance: Attendance = {};
        
        attendanceRecords?.forEach(record => {
          const dateString = format(new Date(record.date), 'yyyy-MM-dd');
          formattedAttendance[dateString] = {
            status: record.status,
            approval_status: record.approval_status,
            reason: record.reason || ''
          };
        });
        
        setAttendanceData(formattedAttendance);
        
        // Now fetch leave data
        const leaveTable = isTrainee ? 'trainee_leave' : 'staff_leave';
        const leaveIdColumn = isTrainee ? 'trainee_id' : 'staff_id';
        
        let leaveQuery = supabase.from(leaveTable).select('*').eq(leaveIdColumn, userId);
        
        if (startDate && endDate) {
          // Filter leaves that overlap with the date range
          leaveQuery = leaveQuery.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
        }
        
        const { data: leaveRecords, error: leaveError } = await leaveQuery;
        
        if (leaveError) throw leaveError;
        
        setLeaveData(leaveRecords || []);
        
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [userId, isTrainee, startDate, endDate]);

  // Process attendance records to highlight absences and leaves
  const getAttendanceRecords = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    
    // Process absences from attendance data
    const specialStatuses = ['leave', 'on_leave', 'suspension', 'resignation', 'termination'];
    
    Object.entries(attendanceData).forEach(([date, data]) => {
      if (data.status.toLowerCase() === 'absent' || specialStatuses.includes(data.status.toLowerCase())) {
        const isSpecialStatus = specialStatuses.includes(data.status.toLowerCase());
        
        const type = isSpecialStatus 
          ? (data.status.toLowerCase() as 'absent' | 'present' | 'leave' | 'on_leave' | 'suspension' | 'resignation' | 'termination') 
          : 'absent';
          
        // Always use status as the reason
        records.push({
          date,
          status: data.status,
          approval_status: data.approval_status,
          type,
          reason: data.reason || data.status
        });
      }
    });
    
    return records;
  };
  
  // Process leave records
  const getLeaveRecords = (): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    
    leaveData.forEach(leave => {
      const startDateObj = new Date(leave.start_date);
      const endDateObj = new Date(leave.end_date);
      
      // Calculate the duration in days
      const durationMs = endDateObj.getTime() - startDateObj.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the end day
      
      records.push({
        date: format(startDateObj, 'yyyy-MM-dd'),
        status: 'Leave',
        approval_status: leave.status,
        type: 'leave',
        reason: leave.reason,
        duration: `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`
      });
    });
    
    return records;
  };
  
  // Convert to strings for easier display
  const getFormattedAbsences = (): AttendanceRecord[] => {
    return getAttendanceRecords();
  };

  const getFormattedLeaves = (): AttendanceRecord[] => {
    return getLeaveRecords();
  };

  return {
    attendanceData,
    leaveData,
    isLoading,
    error,
    getFormattedAbsences,
    getFormattedLeaves
  };
};

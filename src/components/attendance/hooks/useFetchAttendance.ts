
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { 
  AttendanceRecord, 
  PersonType, 
  getAttendanceMapping, 
  getLeaveMapping, 
  LeaveRecord 
} from "@/types/attendance";

export const useFetchAttendance = (
  userId?: string, 
  personType: PersonType = 'trainee', 
  startDate?: string, 
  endDate?: string
) => {
  const [attendanceData, setAttendanceData] = useState<Record<string, {
    status: string;
    approval_status: string;
    reason?: string;
  }>>({});
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchAttendance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the mapping helpers to determine table names and id columns
        const { tableName, idField } = getAttendanceMapping(personType);
        
        let query = supabase.from(tableName).select('*');
        
        // Fix type handling for dynamic queries
        query = query.eq(idField, userId as any);
        
        if (startDate && endDate) {
          query = query.gte('date', startDate).lte('date', endDate);
        }
        
        const { data: attendanceRecords, error: attendanceError } = await query;
        
        if (attendanceError) throw attendanceError;
        
        // Format attendance data
        const formattedAttendance: Record<string, {
          status: string;
          approval_status: string;
          reason: string;
        }> = {};
        
        // Use proper type assertion for safety
        attendanceRecords?.forEach((record: any) => {
          const dateString = format(new Date(record.date), 'yyyy-MM-dd');
          formattedAttendance[dateString] = {
            status: record.status || 'absent',
            approval_status: record.approval_status || 'pending',
            reason: record.reason || ''
          };
        });
        
        setAttendanceData(formattedAttendance);
        
        // Now fetch leave data using the mapping helpers
        const leaveMapping = getLeaveMapping(personType);
        
        let leaveQuery = supabase.from(leaveMapping.tableName).select('*');
        
        // Fix type handling for dynamic queries
        leaveQuery = leaveQuery.eq(leaveMapping.idField, userId as any);
        
        if (startDate && endDate) {
          // Filter leaves that overlap with the date range
          leaveQuery = leaveQuery.or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
        }
        
        const { data: leaveRecords, error: leaveError } = await leaveQuery;
        
        if (leaveError) throw leaveError;
        
        // Transform leave records to our expected format with proper type handling
        const typedLeaveRecords: LeaveRecord[] = (leaveRecords || []).map((record: any) => ({
          id: record.id || `leave-${record.start_date}`,
          type: 'leave',
          start_date: record.start_date,
          end_date: record.end_date,
          reason: record.reason || 'Leave',
          status: record.status || 'pending',
          leave_type: record.leave_type
        }));
        
        setLeaveData(typedLeaveRecords);
        
        // Process and combine all records
        const allRecords = processAttendanceData(formattedAttendance, typedLeaveRecords);
        setRecords(allRecords);
        
      } catch (err: any) {
        console.error('Error fetching attendance:', err);
        setError(err?.message || 'Failed to load attendance data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendance();
  }, [userId, personType, startDate, endDate]);

  // Process attendance records to highlight absences and leaves
  const processAttendanceData = (
    attendanceData: Record<string, { status: string; approval_status: string; reason?: string }>, 
    leaveData: LeaveRecord[]
  ): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    
    // Process absences from attendance data
    const specialStatuses = ['leave', 'on_leave', 'suspension', 'resignation', 'termination'];
    
    Object.entries(attendanceData).forEach(([date, data]) => {
      if (data.status.toLowerCase() === 'absent' || specialStatuses.includes(data.status.toLowerCase())) {
        const isSpecialStatus = specialStatuses.includes(data.status.toLowerCase());
        
        const type = isSpecialStatus 
          ? data.status.toLowerCase() as any  // Type assertion since typescript doesn't narrow properly here
          : 'absent' as any;
          
        records.push({
          id: `attendance-${date}`,
          date,
          type,
          approval_status: data.approval_status as any,
          reason: data.reason || data.status
        });
      }
    });
    
    // Process leave records
    leaveData.forEach(leave => {
      const startDateObj = new Date(leave.start_date);
      const endDateObj = new Date(leave.end_date);
      
      // Calculate the duration in days
      const durationMs = endDateObj.getTime() - startDateObj.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the end day
      
      // Fix the status property in AttendanceRecord with type assertion
      records.push({
        id: leave.id,
        date: `${format(startDateObj, 'yyyy-MM-dd')} - ${format(endDateObj, 'yyyy-MM-dd')}`,
        type: 'leave',
        approval_status: leave.status as any,
        reason: leave.reason,
        absence_type: leave.leave_type,
        duration: `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`
      } as AttendanceRecord);
    });
    
    return records;
  };

  return {
    attendanceData,
    leaveData,
    isLoading,
    error,
    data: records
  };
};

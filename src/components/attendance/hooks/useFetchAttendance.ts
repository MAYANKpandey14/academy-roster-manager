
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface AttendanceRecord {
  id: string;
  date: string;
  type: string;
  reason?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  recordType: "absence" | "leave";
  recordId: string;
  leave_type?: string;
}

export function useFetchAttendance(
  personId: string | null, 
  personType: 'staff' | 'trainee',
  startDate?: Date,
  endDate?: Date
) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isHindi } = useLanguage();

  // Format dates for API request
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : 
    format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd');
  
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : 
    format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!personId) return;

    const fetchAttendanceRecords = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine which tables to query based on personType
        const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
        const leaveTable = personType === 'staff' ? 'staff_leave' : 'trainee_leave';
        const personIdColumn = personType === 'staff' ? 'staff_id' : 'trainee_id';
        
        // Fetch attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from(attendanceTable)
          .select('*')
          .eq(personIdColumn, personId)
          .gte('date', formattedStartDate)
          .lte('date', formattedEndDate)
          .order('date', { ascending: false });
          
        if (attendanceError) throw attendanceError;
        
        // Fetch leave records
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select('*')
          .eq(personIdColumn, personId)
          .or(`start_date.gte.${formattedStartDate},end_date.gte.${formattedStartDate}`)
          .or(`start_date.lte.${formattedEndDate},end_date.lte.${formattedEndDate}`)
          .order('start_date', { ascending: false });
          
        if (leaveError) throw leaveError;

        // Process attendance data
        const formattedAttendanceRecords: AttendanceRecord[] = (attendanceData || []).map(record => ({
          id: `attendance-${record.id}`,
          date: format(new Date(record.date), 'yyyy-MM-dd'),
          type: record.status || 'present',
          approvalStatus: (record.approval_status || 'pending') as "pending" | "approved" | "rejected",
          recordType: "absence",
          recordId: record.id,
        }));
        
        // Process leave data 
        const formattedLeaveRecords: AttendanceRecord[] = (leaveData || []).map(record => ({
          id: `leave-${record.id}`,
          date: `${format(new Date(record.start_date), 'yyyy-MM-dd')} to ${format(new Date(record.end_date), 'yyyy-MM-dd')}`,
          type: 'on_leave',
          reason: record.reason,
          approvalStatus: (record.status || 'pending') as "pending" | "approved" | "rejected",
          recordType: "leave",
          recordId: record.id,
          leave_type: record.leave_type
        }));
        
        // Combine and sort all records by date (most recent first)
        setRecords([...formattedAttendanceRecords, ...formattedLeaveRecords]
          .sort((a, b) => {
            const dateA = a.date.split(' to ')[0]; 
            const dateB = b.date.split(' to ')[0];
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          }));
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(isHindi 
          ? 'उपस्थिति डेटा प्राप्त करने में विफल' 
          : 'Failed to fetch attendance data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [personId, personType, formattedStartDate, formattedEndDate, isHindi]);

  return { records, isLoading, error };
}

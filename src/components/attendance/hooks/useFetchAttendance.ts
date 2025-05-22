
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { PersonType } from '../types/attendanceTypes';

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

// Simple type definitions to avoid excessive type instantiation
interface BaseDbRecord {
  id: string;
}

interface AttendanceDbRecord extends BaseDbRecord {
  date: string;
  status: string;
  approval_status?: string;
}

interface LeaveDbRecord extends BaseDbRecord {
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string;
}

export function useFetchAttendance(
  personId: string | null, 
  personType: PersonType,
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
          .select('id, date, status, approval_status')
          .eq(personIdColumn, personId)
          .gte('date', formattedStartDate)
          .lte('date', formattedEndDate)
          .order('date', { ascending: false });
          
        if (attendanceError) throw attendanceError;
        
        // Fetch leave records
        const { data: leaveData, error: leaveError } = await supabase
          .from(leaveTable)
          .select('id, start_date, end_date, reason, status, leave_type')
          .eq(personIdColumn, personId)
          .order('start_date', { ascending: false });
          
        if (leaveError) throw leaveError;

        // Filter leave records that fall within the date range
        const filteredLeaveData = (leaveData || []).filter((record) => {
          const leaveStart = new Date(record.start_date);
          const leaveEnd = new Date(record.end_date);
          const rangeStart = new Date(formattedStartDate);
          const rangeEnd = new Date(formattedEndDate);
          
          // If leave period overlaps with the date range
          return (leaveStart <= rangeEnd && leaveEnd >= rangeStart);
        });

        // Extract the status part for reason if it contains a colon (format: "absent: reason")
        const extractReason = (status: string): { type: string, reason?: string } => {
          if (status.includes(':')) {
            const [type, reason] = status.split(':', 2);
            return { type: type.trim(), reason: reason.trim() };
          }
          return { type: status };
        };

        // Process attendance data
        const formattedAttendanceRecords: AttendanceRecord[] = (attendanceData || []).map((record) => {
          const { type, reason } = extractReason(record.status || 'present');
          return {
            id: `attendance-${record.id}`,
            date: format(new Date(record.date), 'yyyy-MM-dd'),
            type,
            reason,
            approvalStatus: (record.approval_status as "pending" | "approved" | "rejected") || "pending",
            recordType: "absence",
            recordId: record.id,
          };
        });
        
        // Process leave data
        const formattedLeaveRecords: AttendanceRecord[] = (filteredLeaveData || []).map((record) => {
          return {
            id: `leave-${record.id}`,
            date: `${format(new Date(record.start_date), 'yyyy-MM-dd')} to ${format(new Date(record.end_date), 'yyyy-MM-dd')}`,
            type: 'on_leave',
            reason: record.reason,
            approvalStatus: record.status as "pending" | "approved" | "rejected",
            recordType: "leave",
            recordId: record.id,
            leave_type: record.leave_type
          };
        });
        
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


import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PersonType } from '../types/attendanceTypes';

export interface BasicAttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  person_id: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string;
  created_at: string;
  updated_at: string;
  person_id: string;
}

export interface PersonAttendanceData {
  attendanceRecords: BasicAttendanceRecord[];
  leaveRecords: LeaveRecord[];
}

// Helper function to parse status and reason from combined status field
function parseStatusAndReason(statusField: string): { status: string; reason: string } {
  if (!statusField) return { status: 'present', reason: '' };
  
  // Check if the status contains a colon (indicating combined format)
  if (statusField.includes(': ')) {
    const [status, ...reasonParts] = statusField.split(': ');
    return {
      status: status.trim(),
      reason: reasonParts.join(': ').trim()
    };
  }
  
  // If no colon, treat the entire field as status
  return {
    status: statusField.trim(),
    reason: ''
  };
}

export function useFetchAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceRecords = useCallback(async (
    personId: string,
    personType: PersonType
  ) => {
    if (!personId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tableName = personType === 'trainee' ? 'trainee_attendance' : 'staff_attendance';
      const personIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq(personIdField, personId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      
      const records: BasicAttendanceRecord[] = [];
      
      if (data) {
        for (const record of data) {
          const approvalStatus = record.approval_status || 'pending';
          const validApprovalStatus: 'pending' | 'approved' | 'rejected' = 
            ['pending', 'approved', 'rejected'].includes(approvalStatus) 
              ? approvalStatus as 'pending' | 'approved' | 'rejected'
              : 'pending';
              
          // Parse the status field to extract status and reason
          const { status, reason } = parseStatusAndReason(record.status);
              
          records.push({
            id: record.id,
            date: record.date,
            status: status,
            approval_status: validApprovalStatus,
            person_id: personId,
            reason: reason,
            created_at: record.created_at,
            updated_at: record.updated_at,
          });
        }
      }
      
      return records;
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to fetch attendance records');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLeaveRecords = useCallback(async (
    personId: string,
    personType: PersonType
  ) => {
    if (!personId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tableName = personType === 'trainee' ? 'trainee_leave' : 'staff_leave';
      const personIdField = personType === 'trainee' ? 'trainee_id' : 'staff_id';
      
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq(personIdField, personId)
        .order('start_date', { ascending: false });

      if (fetchError) throw fetchError;
      
      const records: LeaveRecord[] = [];
      
      if (data) {
        for (const record of data) {
          records.push({
            id: record.id,
            start_date: record.start_date,
            end_date: record.end_date,
            reason: record.reason || '',
            status: record.status,
            leave_type: record.leave_type,
            created_at: record.created_at,
            updated_at: record.updated_at,
            person_id: personId,
          });
        }
      }
      
      return records;
    } catch (err) {
      console.error('Error fetching leave records:', err);
      setError('Failed to fetch leave records');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchAttendanceRecords,
    fetchLeaveRecords,
  };
}

export function useFetchPersonAttendance(
  personId: string,
  personType: PersonType,
  startDate?: string,
  endDate?: string
) {
  const [data, setData] = useState<PersonAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { fetchAttendanceRecords, fetchLeaveRecords } = useFetchAttendance();

  const fetchData = useCallback(async () => {
    if (!personId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [attendanceRecords, leaveRecords] = await Promise.all([
        fetchAttendanceRecords(personId, personType),
        fetchLeaveRecords(personId, personType)
      ]);

      setData({
        attendanceRecords,
        leaveRecords
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [personId, personType, startDate, endDate, fetchAttendanceRecords, fetchLeaveRecords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}


import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PersonType } from '../types/attendanceTypes';

export interface BasicAttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
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

export interface AttendanceRecord extends BasicAttendanceRecord {
  person_type: PersonType;
  attendance_type: string;
  leave_type?: string | null;
  start_date: string;
  end_date: string;
  created_by?: string;
  approved_by?: string | null;
  approved_at?: string | null;
}

export function useFetchAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceRecords = useCallback(async (
    personId: string,
    personType: PersonType
  ): Promise<BasicAttendanceRecord[]> => {
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
      
      return (data || []).map(record => ({
        id: record.id,
        date: record.date,
        status: record.status,
        approval_status: record.approval_status,
        person_id: personId,
        reason: '', // Attendance records don't have reason field
        created_at: record.created_at,
        updated_at: record.updated_at,
      }));
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
  ): Promise<LeaveRecord[]> => {
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
      
      return (data || []).map(record => ({
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason || '',
        status: record.status,
        leave_type: record.leave_type,
        created_at: record.created_at,
        updated_at: record.updated_at,
        person_id: personId,
      }));
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

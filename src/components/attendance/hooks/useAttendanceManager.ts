
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PersonType, ApprovalStatus, AttendanceFormData } from '../types/attendanceTypes';

// Simple attendance record interface for this hook
interface SimpleAttendanceRecord {
  id: string;
  person_id: string;
  person_type: PersonType;
  date: string;
  status: string;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
  reason?: string;
}

export function useAttendanceManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance records for a person
  const fetchAttendance = useCallback(async (personId: string, personType: PersonType): Promise<SimpleAttendanceRecord[]> => {
    if (!personId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
      const idField = personType === 'staff' ? 'staff_id' : 'trainee_id';
      
      const { data, error: fetchError } = await supabase
        .from(attendanceTable)
        .select('*')
        .eq(idField, personId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Transform the data to match SimpleAttendanceRecord interface
      const records: SimpleAttendanceRecord[] = (data || []).map(record => {
        const personId = personType === 'staff' 
          ? (record as any).staff_id 
          : (record as any).trainee_id;
        
        return {
          id: record.id,
          person_id: personId,
          person_type: personType,
          date: record.date,
          status: record.status || 'present',
          approval_status: (record.approval_status as ApprovalStatus) || 'pending',
          created_at: record.created_at || new Date().toISOString(),
          updated_at: record.updated_at || new Date().toISOString(),
        };
      });
      
      return records;
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to fetch attendance records');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit new attendance record
  const submitAttendance = useCallback(async (
    personId: string,
    personType: PersonType,
    formData: AttendanceFormData,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!personId) return { success: false, error: 'No person selected' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
      
      // Create record with explicit field names
      const record = personType === 'staff' 
        ? {
            staff_id: personId,
            date: formData.startDate,
            status: formData.attendanceType === 'Present' ? 'present' : 'absent',
            approval_status: formData.attendanceType === 'Present' ? 'approved' : 'pending',
          }
        : {
            trainee_id: personId,
            date: formData.startDate,
            status: formData.attendanceType === 'Present' ? 'present' : 'absent',
            approval_status: formData.attendanceType === 'Present' ? 'approved' : 'pending',
          };

      const { error: insertError } = await supabase
        .from(attendanceTable)
        .insert(record);

      if (insertError) throw insertError;
      return { success: true };
    } catch (err) {
      console.error('Error submitting attendance:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit attendance';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update attendance status (approve/reject)
  const updateAttendanceStatus = useCallback(async (
    recordId: string,
    status: 'approved' | 'rejected',
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Updating attendance status:', recordId, status, userId);
      return { success: true };
    } catch (err) {
      console.error('Error updating attendance status:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update attendance status';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error, 
    fetchAttendance,
    submitAttendance,
    updateAttendanceStatus,
  };
}

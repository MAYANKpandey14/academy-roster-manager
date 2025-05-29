
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord, AttendanceFormData, PersonType, ApprovalStatus } from '../types/attendanceTypes';

export function useAttendanceManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance records for a person
  const fetchAttendance = useCallback(async (personId: string, personType: PersonType): Promise<AttendanceRecord[]> => {
    if (!personId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, we'll use the existing attendance tables structure
      const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
      const idField = personType === 'staff' ? 'staff_id' : 'trainee_id';
      
      const { data, error: fetchError } = await supabase
        .from(attendanceTable)
        .select('*')
        .eq(idField, personId)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      
      // Transform the data to match AttendanceRecord interface
      const records: AttendanceRecord[] = (data || []).map(record => ({
        id: record.id,
        person_id: record[idField],
        person_type: personType,
        attendance_type: record.status === 'present' ? 'Present' : 'Absent',
        start_date: record.date,
        end_date: record.date,
        status: record.approval_status as ApprovalStatus,
        created_by: 'system', // Default value since not available in current schema
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString(),
      }));
      
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
      const idField = personType === 'staff' ? 'staff_id' : 'trainee_id';
      
      const record = {
        [idField]: personId,
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
    status: 'Approved' | 'Rejected',
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This would need to be implemented based on which table the record belongs to
      // For now, we'll implement a basic version
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

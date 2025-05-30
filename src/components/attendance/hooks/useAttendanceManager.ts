import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord, AttendanceFormData, PersonType, ApprovalStatus } from '../types/attendanceTypes';

// Define the database types for attendance records
interface Database {
  public: {
    Tables: {
      attendance_records: {
        Row: AttendanceRecord;
        Insert: Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AttendanceRecord, 'id' | 'created_at' | 'person_id' | 'person_type'>>;
      };
    };
  };
}

// Helper function to get the Supabase client with types
export const getSupabase = () => {
  return supabase as unknown as import('@supabase/supabase-js').SupabaseClient<Database>;
};

export function useAttendanceManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch attendance records for a person
  const fetchAttendance = useCallback(async (personId: string, personType: PersonType) => {
    if (!personId) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await getSupabase()
        .from('attendance_records')
        .select('*')
        .eq('person_id', personId)
        .eq('person_type', personType)
        .order('start_date', { ascending: false });

      if (fetchError) throw fetchError;
      return data as AttendanceRecord[];
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
      const record = {
        person_id: personId,
        person_type: personType,
        attendance_type: formData.attendanceType,
        leave_type: formData.attendanceType === 'On Leave' ? formData.leaveType : null,
        start_date: formData.startDate,
        end_date: formData.attendanceType === 'On Leave' ? formData.endDate : formData.startDate,
        reason: formData.reason,
        status: formData.attendanceType === 'On Leave' || formData.attendanceType === 'Resignation' 
          ? 'Pending' as ApprovalStatus 
          : 'Approved' as ApprovalStatus,
        created_by: userId,
      };

      const { error: insertError } = await getSupabase()
        .from('attendance_records')
        .insert({
          ...record,
          id: undefined, // Let the database generate the ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Database['public']['Tables']['attendance_records']['Insert']);

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
const { error: updateError } = await getSupabase()
        .from('attendance_records')
        .update({
          status,
          approved_by: userId,
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Database['public']['Tables']['attendance_records']['Update'])
        .eq('id', recordId);

      if (updateError) throw updateError;
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

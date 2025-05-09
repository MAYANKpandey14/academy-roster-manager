
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define explicit types for history records
export interface AbsenceRecord {
  id: string;
  person_id: string;
  date: string;
  reason: string;
  created_at: string;
  type: 'absence';
  status: string; // Status field is required for absence records
}

export interface LeaveRecord {
  id: string;
  person_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at: string;
  type: 'leave';
}

export type HistoryRecord = AbsenceRecord | LeaveRecord;

// Custom hook for absences
export const useAbsences = (personId?: string) => {
  return useQuery({
    queryKey: ['absences', personId],
    queryFn: async () => {
      // Use the correct table names based on Supabase schema
      const { data, error } = await supabase
        .from('trainee_attendance') 
        .select('*')
        .eq('trainee_id', personId || '')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Map the data to the expected AbsenceRecord format
      const absences: AbsenceRecord[] = (data || []).map(item => ({
        id: item.id,
        person_id: item.trainee_id,
        date: item.date,
        // The database record doesn't have a 'reason' field, so use the status instead
        reason: item.status || 'absent',
        status: item.status || 'absent',
        created_at: item.created_at,
        type: 'absence'
      }));
      
      return absences;
    },
    enabled: !!personId,
  });
};

// Custom hook for leaves
export const useLeaves = (personId?: string) => {
  return useQuery({
    queryKey: ['leaves', personId],
    queryFn: async () => {
      // Use the correct table names based on Supabase schema
      const { data, error } = await supabase
        .from('trainee_leave')
        .select('*')
        .eq('trainee_id', personId || '')
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      // Map the data to the expected LeaveRecord format
      const leaves: LeaveRecord[] = (data || []).map(item => ({
        id: item.id,
        person_id: item.trainee_id,
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason || 'No reason provided',
        status: item.status || 'pending',
        created_at: item.created_at,
        type: 'leave'
      }));
      
      return leaves;
    },
    enabled: !!personId,
  });
};

// Combined hook that returns both query hooks
export const useLeaveHistory = () => {
  return {
    useAbsences,
    useLeaves
  };
};

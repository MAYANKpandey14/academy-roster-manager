
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define types for the records
export interface AbsenceRecord {
  id: string;
  type: 'absence';
  date: string;
  status: string;
  reason: string; // Adding reason explicitly to type definition
}

export interface LeaveRecord {
  id: string;
  type: 'leave';
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

export type HistoryRecord = AbsenceRecord | LeaveRecord;

export const useAbsences = (personId?: string) => {
  return useQuery<AbsenceRecord[], Error>({
    queryKey: ['absences', personId],
    enabled: !!personId,
    queryFn: async () => {
      if (!personId) return [];
      
      const { data, error } = await supabase
        .from('trainee_attendance')
        .select('*')
        .eq('trainee_id', personId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching absences:", error);
        throw error;
      }
      
      // Map the database records to our expected format
      // Note: The status field in the database contains the reason text
      return (data || []).map(record => ({
        id: record.id,
        type: 'absence' as const,
        date: record.date,
        status: record.status,
        reason: record.status // Using the status field as the reason field since that's where the reason is stored
      }));
    }
  });
};

export const useLeaves = (personId?: string) => {
  return useQuery<LeaveRecord[], Error>({
    queryKey: ['leaves', personId],
    enabled: !!personId,
    queryFn: async () => {
      if (!personId) return [];
      
      const { data, error } = await supabase
        .from('trainee_leave')
        .select('*')
        .eq('trainee_id', personId)
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching leaves:", error);
        throw error;
      }
      
      // Map the database records to our expected format
      return (data || []).map(record => ({
        id: record.id,
        type: 'leave' as const,
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason,
        status: record.status
      }));
    }
  });
};

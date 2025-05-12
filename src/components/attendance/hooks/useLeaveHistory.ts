
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define types for the records
export interface AbsenceRecord {
  id: string;
  type: 'absence';
  date: string;
  status: string;
  reason: string; 
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
      
      // Fix type handling for Supabase query with type assertion
      const { data, error } = await supabase
        .from('trainee_attendance')
        .select('*')
        .eq('trainee_id', personId as any)
        .order('date', { ascending: false });
      
      if (error) {
        console.error("Error fetching absences:", error);
        throw error;
      }
      
      // Properly type-check and transform the data
      return (data || []).map((record: any) => ({
        id: record.id || `absence-${record.date}`,
        type: 'absence' as const,
        date: record.date,
        status: record.status || 'absent',
        reason: record.reason || record.status || 'Absent'
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
      
      // Fix type handling for Supabase query with type assertion
      const { data, error } = await supabase
        .from('trainee_leave')
        .select('*')
        .eq('trainee_id', personId as any)
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching leaves:", error);
        throw error;
      }
      
      // Properly type-check and transform the data
      return (data || []).map((record: any) => ({
        id: record.id || `leave-${record.start_date}`,
        type: 'leave' as const,
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason || 'Leave',
        status: record.status || 'pending'
      }));
    }
  });
};


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define explicit types for history records
export interface AbsenceRecord {
  id: number;
  person_id: string;
  date: string;
  reason: string;
  created_at: string;
  type: 'absence';
}

export interface LeaveRecord {
  id: number;
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
      const { data, error } = await supabase
        .from('absences')
        .select('*')
        .eq('person_id', personId || '')
        .order('date', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item): AbsenceRecord => ({
        ...item,
        type: 'absence'
      }));
    },
    enabled: !!personId,
  });
};

// Custom hook for leaves
export const useLeaves = (personId?: string) => {
  return useQuery({
    queryKey: ['leaves', personId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaves')
        .select('*')
        .eq('person_id', personId || '')
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((item): LeaveRecord => ({
        ...item,
        type: 'leave'
      }));
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

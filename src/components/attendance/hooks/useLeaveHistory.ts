
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AbsenceRecord, LeaveRecord, HistoryRecord } from "../types/leaveHistory";
import { useState, useEffect } from "react";

export function useLeaveHistory(personId?: string, personType: 'trainee' | 'staff' = 'trainee') {
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const absencesQuery = useQuery({
    queryKey: ['absences', personId, personType],
    queryFn: async () => {
      if (!personId) return [];
      
      const { data, error } = await supabase
        .from(`${personType}_attendance`)
        .select("*")
        .eq(`${personType}_id`, personId)
        .eq("status", "absent")
        .order("date", { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return (data || []) as AbsenceRecord[];
    },
    enabled: !!personId
  });
  
  const leavesQuery = useQuery({
    queryKey: ['leaves', personId, personType],
    queryFn: async () => {
      if (!personId) return [];
      
      const { data, error } = await supabase
        .from(`${personType}_leave`)
        .select("*")
        .eq(`${personType}_id`, personId)
        .order("start_date", { ascending: false });
        
      if (error) throw new Error(error.message);
      
      return (data || []) as LeaveRecord[];
    },
    enabled: !!personId
  });

  useEffect(() => {
    if (absencesQuery.data && leavesQuery.data) {
      // Transform absences to history records
      const absenceRecords: HistoryRecord[] = absencesQuery.data.map(absence => ({
        id: absence.id,
        type: 'absent',
        start_date: absence.date,
        end_date: absence.date,
        reason: undefined,
        leave_type: null
      }));

      // Transform leaves to history records
      const leaveRecords: HistoryRecord[] = leavesQuery.data.map(leave => ({
        id: leave.id,
        type: 'leave',
        start_date: leave.start_date,
        end_date: leave.end_date,
        reason: leave.reason,
        leave_type: leave.leave_type
      }));

      // Combine and sort by start_date (most recent first)
      const combined = [...absenceRecords, ...leaveRecords].sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      
      setHistoryData(combined);
      setIsLoading(absencesQuery.isLoading || leavesQuery.isLoading);
    }
  }, [absencesQuery.data, leavesQuery.data, absencesQuery.isLoading, leavesQuery.isLoading]);

  return {
    historyData,
    isLoading,
    refetch: () => {
      absencesQuery.refetch();
      leavesQuery.refetch();
    }
  };
}

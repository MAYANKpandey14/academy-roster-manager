
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PersonType } from "../types";
import { 
  AbsenceRecord, 
  LeaveRecord, 
  HistoryRecord, 
  AttendanceResponse, 
  LeaveResponse 
} from "../types/leaveHistory";

export function useLeaveHistory(type: PersonType, personId: string) {
  const [absencesData, setAbsencesData] = useState<AbsenceRecord[]>([]);
  const [leavesData, setLeavesData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch absence data with explicit return type
  const fetchAbsences = useQuery({
    queryKey: [`${type}-absences`, personId],
    queryFn: async (): Promise<AttendanceResponse[]> => {
      try {
        const { data, error } = await supabase
          .from(`${type}_attendance`)
          .select('*')
          .eq(`${type}_id`, personId)
          .eq('status', 'absent');

        if (error) throw error;
        return (data || []) as AttendanceResponse[];
      } catch (error) {
        console.error('Error fetching absences:', error);
        return [] as AttendanceResponse[];
      }
    },
    enabled: !!personId,
  });

  // Fetch leave data with explicit return type
  const fetchLeaves = useQuery({
    queryKey: [`${type}-leaves`, personId],
    queryFn: async (): Promise<LeaveResponse[]> => {
      try {
        const { data, error } = await supabase
          .from(`${type}_leave`)
          .select('*')
          .eq(`${type}_id`, personId);

        if (error) throw error;
        return (data || []) as LeaveResponse[];
      } catch (error) {
        console.error('Error fetching leaves:', error);
        return [] as LeaveResponse[];
      }
    },
    enabled: !!personId,
  });

  // Process data separately from the query to avoid type issues
  useEffect(() => {
    if (fetchAbsences.data) {
      const processed: AbsenceRecord[] = fetchAbsences.data.map(item => ({
        id: item.id,
        date: item.date,
        status: item.status,
        type: 'absent',
        start_date: item.date,
        end_date: item.date,
        leave_type: null,
        reason: undefined
      }));
      setAbsencesData(processed);
    }
    
    if (fetchLeaves.data) {
      const processed: LeaveRecord[] = fetchLeaves.data.map(item => ({
        id: item.id,
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason,
        status: 'on_leave',
        leave_type: item.leave_type,
        type: 'leave'
      }));
      setLeavesData(processed);
    }
    
    setIsLoading(fetchAbsences.isLoading || fetchLeaves.isLoading);
  }, [fetchAbsences.data, fetchLeaves.data, fetchAbsences.isLoading, fetchLeaves.isLoading]);

  // Combine and sort the data
  const historyData: HistoryRecord[] = [
    ...absencesData, 
    ...leavesData
  ].sort((a, b) => {
    // Sort by date (most recent first)
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA;
  });

  return {
    historyData,
    isLoading
  };
}


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AbsenceRecord, LeaveRecord } from "../types/leaveHistory";

export function useLeaveHistory(personId?: string, personType: 'trainee' | 'staff' = 'trainee') {
  const fetchAbsences = () => {
    return useQuery({
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
  };
  
  const fetchLeaves = () => {
    return useQuery({
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
  };
  
  return {
    useAbsences: fetchAbsences,
    useLeaves: fetchLeaves
  };
}

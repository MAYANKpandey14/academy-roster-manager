
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/textUtils";
import { useLanguage } from "@/contexts/LanguageContext";

// Use more specific types to avoid infinite type instantiation
export type AttendanceStatus = 'present' | 'absent' | 'on_leave';

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  leave_type?: string;
  reason?: string;
  [key: string]: any;
}

export const useFetchAttendance = (personId: string, personType: 'trainee' | 'staff', monthDate?: Date) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<AttendanceRecord[] | null>(null);
  const { isHindi } = useLanguage();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!personId) return;
      
      setIsLoading(true);
      
      try {
        const tableName = `${personType}_attendance`;
        const month = monthDate ? new Date(monthDate) : new Date();
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq(`${personType}_id`, personId)
          .gte('date', startOfMonth)
          .lte('date', endOfMonth)
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        setData(data as AttendanceRecord[]);
      } catch (error) {
        console.error(`Error fetching ${personType} attendance records:`, error);
        showError(isHindi
          ? `उपस्थिति डेटा लाने में त्रुटि`
          : `Error fetching attendance data`
        );
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [personId, personType, monthDate, isHindi]);

  return { isLoading, data };
};

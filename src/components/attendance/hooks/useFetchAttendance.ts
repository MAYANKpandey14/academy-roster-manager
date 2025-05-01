
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/textUtils";
import { useLanguage } from "@/contexts/LanguageContext";

// Use more specific types to avoid infinite type instantiation
type AttendanceStatus = 'present' | 'absent' | 'leave';
type AttendanceData = {
  id: string;
  date: string;
  status: AttendanceStatus;
  [key: string]: any; // Use any for additional properties to avoid deep type instantiation
}

export const useFetchAttendance = (personId: string, personType: 'trainee' | 'staff', date: Date) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const { isHindi } = useLanguage();

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      if (!personId) return;
      
      setIsLoading(true);
      try {
        const tableName = `${personType}_attendance`;
        const { data, error } = await supabase.from(tableName)
          .select('*')
          .eq(`${personType}_id`, personId)
          .eq('date', date.toISOString().split('T')[0])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setStatus(data.status as AttendanceStatus);
        } else {
          setStatus(null);
        }
      } catch (error) {
        console.error(`Error fetching ${personType} attendance:`, error);
        showError(isHindi
          ? `उपस्थिति डेटा लाने में त्रुटि`
          : `Error fetching attendance data`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStatus();
  }, [personId, personType, date, isHindi]);

  return { isLoading, status };
};

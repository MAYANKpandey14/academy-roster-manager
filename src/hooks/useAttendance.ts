
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AttendanceRecord {
  id?: string;
  pno: string;
  name: string;
  rank?: string;
  phone?: string;
  type: 'Absent' | 'On Leave';
  leave_type?: 'CL' | 'EL' | 'ML' | 'Maternity Leave' | null;
  date_from: string;
  date_to: string;
  reason?: string;
  created_at?: string;
}

export function useAttendance() {
  // Fetch all attendance records
  const fetchAttendance = (pno?: string) => {
    return useQuery({
      queryKey: ['attendance', pno],
      queryFn: async () => {
        try {
          const { data, error } = await supabase.functions.invoke('get-attendance', {
            body: pno ? { pno } : undefined
          });
          
          if (error) throw new Error(error.message);
          return data.data || [];
        } catch (error) {
          console.error('Error fetching attendance:', error);
          toast.error('अटेंडेंस डेटा प्राप्त करने में त्रुटि हुई');
          return [];
        }
      }
    });
  };

  // Add a new attendance record
  const addAttendance = (queryClient: QueryClient) => {
    return useMutation({
      mutationFn: async (record: AttendanceRecord) => {
        const { data, error } = await supabase.functions.invoke('add-attendance', {
          body: record
        });
        
        if (error) throw new Error(error.message);
        return data;
      },
      onSuccess: () => {
        toast.success('अटेंडेंस रिकॉर्ड सफलतापूर्वक जोड़ा गया');
        queryClient.invalidateQueries({ queryKey: ['attendance'] });
      },
      onError: (error) => {
        console.error('Error adding attendance:', error);
        toast.error(`अटेंडेंस रिकॉर्ड जोड़ने में त्रुटि: ${error.message}`);
      }
    });
  };

  return {
    fetchAttendance,
    addAttendance
  };
}

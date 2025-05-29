
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

interface StaffAttendanceRecord extends AttendanceRecord {
  staff_id: string;
  staff?: {
    id: string;
    name: string;
    pno: string;
    rank: string;
  };
}

interface TraineeAttendanceRecord extends AttendanceRecord {
  trainee_id: string;
  trainee?: {
    id: string;
    name: string;
    pno: string;
    chest_no: string;
  };
}

export const useFetchAttendance = () => {
  const fetchStaffAttendance = useQuery({
    queryKey: ['staff-attendance'],
    queryFn: async (): Promise<StaffAttendanceRecord[]> => {
      const { data, error } = await supabase
        .from('staff_attendance')
        .select(`
          *,
          staff (
            id,
            name,
            pno,
            rank
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching staff attendance:', error);
        throw error;
      }

      return data || [];
    },
  });

  const fetchTraineeAttendance = useQuery({
    queryKey: ['trainee-attendance'],
    queryFn: async (): Promise<TraineeAttendanceRecord[]> => {
      const { data, error } = await supabase
        .from('trainee_attendance')
        .select(`
          *,
          trainee:trainees (
            id,
            name,
            pno,
            chest_no
          )
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching trainee attendance:', error);
        throw error;
      }

      return data || [];
    },
  });

  return {
    staffAttendance: fetchStaffAttendance.data || [],
    traineeAttendance: fetchTraineeAttendance.data || [],
    isLoadingStaff: fetchStaffAttendance.isLoading,
    isLoadingTrainee: fetchTraineeAttendance.isLoading,
    staffError: fetchStaffAttendance.error,
    traineeError: fetchTraineeAttendance.error,
    refetchStaff: fetchStaffAttendance.refetch,
    refetchTrainee: fetchTraineeAttendance.refetch,
  };
};

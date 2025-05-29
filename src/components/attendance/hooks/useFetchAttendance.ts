
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord } from '../types/attendanceTypes';

// Export the main AttendanceRecord for compatibility
export type { AttendanceRecord };

// Simplified interface to avoid type instantiation issues
export interface BasicAttendanceRecord {
  id: string;
  date: string;
  status: string;
  approval_status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
  person_id: string;
  reason?: string;
}

export interface LeaveRecord {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  leave_type: string;
  created_at: string;
  updated_at: string;
  person_id: string;
}

// Hook for fetching all attendance (used in management views)
export const useFetchAttendance = () => {
  const fetchStaffAttendance = useQuery({
    queryKey: ['staff-attendance'],
    queryFn: async (): Promise<AttendanceRecord[]> => {
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

      return (data || []).map(record => ({
        id: record.id,
        person_id: record.staff_id,
        date: record.date,
        status: record.status,
        approval_status: record.approval_status as 'approved' | 'pending' | 'rejected',
        created_at: record.created_at,
        updated_at: record.updated_at,
      }));
    },
  });

  const fetchTraineeAttendance = useQuery({
    queryKey: ['trainee-attendance'],
    queryFn: async (): Promise<AttendanceRecord[]> => {
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

      return (data || []).map(record => ({
        id: record.id,
        person_id: record.trainee_id,
        date: record.date,
        status: record.status,
        approval_status: record.approval_status as 'approved' | 'pending' | 'rejected',
        created_at: record.created_at,
        updated_at: record.updated_at,
      }));
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

// Hook for fetching attendance for a specific person
export const useFetchPersonAttendance = (personId: string, personType: 'staff' | 'trainee', startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['person-attendance', personId, personType, startDate, endDate],
    queryFn: async () => {
      const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
      const idField = personType === 'staff' ? 'staff_id' : 'trainee_id';
      
      let attendanceQuery = supabase
        .from(attendanceTable)
        .select('*')
        .eq(idField, personId)
        .order('date', { ascending: false });

      if (startDate) attendanceQuery = attendanceQuery.gte('date', startDate);
      if (endDate) attendanceQuery = attendanceQuery.lte('date', endDate);

      const { data: attendanceData, error: attendanceError } = await attendanceQuery;
      
      if (attendanceError) throw attendanceError;

      const leaveTable = personType === 'staff' ? 'staff_leave' : 'trainee_leave';
      
      let leaveQuery = supabase
        .from(leaveTable)
        .select('*')
        .eq(idField, personId)
        .order('start_date', { ascending: false });

      if (startDate) leaveQuery = leaveQuery.gte('start_date', startDate);
      if (endDate) leaveQuery = leaveQuery.lte('end_date', endDate);

      const { data: leaveData, error: leaveError } = await leaveQuery;
      
      if (leaveError) throw leaveError;

      const attendanceRecords: AttendanceRecord[] = (attendanceData || []).map(record => {
        const personId = personType === 'staff' 
          ? (record as any).staff_id 
          : (record as any).trainee_id;
        
        return {
          id: record.id,
          person_id: personId,
          date: record.date,
          status: record.status,
          approval_status: record.approval_status as 'approved' | 'pending' | 'rejected',
          created_at: record.created_at,
          updated_at: record.updated_at,
        };
      });

      const leaveRecords: LeaveRecord[] = (leaveData || []).map(record => {
        const personId = personType === 'staff' 
          ? (record as any).staff_id 
          : (record as any).trainee_id;
        
        return {
          id: record.id,
          person_id: personId,
          start_date: record.start_date,
          end_date: record.end_date,
          reason: record.reason,
          status: record.status as 'approved' | 'pending' | 'rejected',
          leave_type: record.leave_type,
          created_at: record.created_at,
          updated_at: record.updated_at,
        };
      });

      return {
        attendanceRecords,
        leaveRecords
      };
    },
    enabled: !!personId,
  });
};

// Function for fetching attendance data for print functionality
export const fetchAttendanceForPrint = async (personId: string, personType: 'staff' | 'trainee'): Promise<{ attendanceRecords: AttendanceRecord[], leaveRecords: LeaveRecord[] }> => {
  const attendanceTable = personType === 'staff' ? 'staff_attendance' : 'trainee_attendance';
  const leaveTable = personType === 'staff' ? 'staff_leave' : 'trainee_leave';
  const idField = personType === 'staff' ? 'staff_id' : 'trainee_id';

  const { data: attendanceData, error: attendanceError } = await supabase
    .from(attendanceTable)
    .select('*')
    .eq(idField, personId)
    .order('date', { ascending: false })
    .limit(10);

  if (attendanceError) throw attendanceError;

  const { data: leaveData, error: leaveError } = await supabase
    .from(leaveTable)
    .select('*')
    .eq(idField, personId)
    .order('start_date', { ascending: false })
    .limit(10);

  if (leaveError) throw leaveError;

  const attendanceRecords: AttendanceRecord[] = (attendanceData || []).map(record => {
    const personId = personType === 'staff' 
      ? (record as any).staff_id 
      : (record as any).trainee_id;
    
    return {
      id: record.id,
      person_id: personId,
      date: record.date,
      status: record.status,
      approval_status: record.approval_status as 'approved' | 'pending' | 'rejected',
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  });

  const leaveRecords: LeaveRecord[] = (leaveData || []).map(record => {
    const personId = personType === 'staff' 
      ? (record as any).staff_id 
      : (record as any).trainee_id;
    
    return {
      id: record.id,
      person_id: personId,
      start_date: record.start_date,
      end_date: record.end_date,
      reason: record.reason,
      status: record.status as 'approved' | 'pending' | 'rejected',
      leave_type: record.leave_type,
      created_at: record.created_at,
      updated_at: record.updated_at,
    };
  });

  return { attendanceRecords, leaveRecords };
};

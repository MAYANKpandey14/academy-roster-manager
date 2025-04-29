
import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AttendanceFormValues } from "../schema";
import { StaffLeave, TraineeLeave, StaffAttendance, TraineeAttendance, PersonType } from "../types";

export function useAttendanceSubmit(type: PersonType, personId?: string, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AttendanceFormValues) => {
    if (!personId) {
      toast.error("कृपया पहले पीएनओ खोजें");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const startDate = format(values.start_date, 'yyyy-MM-dd');
      const endDate = format(values.end_date, 'yyyy-MM-dd');
      
      // If status is 'on_leave', create a leave record
      if (values.status === 'on_leave') {
        if (type === 'trainee') {
          const leaveData: TraineeLeave = {
            trainee_id: personId,
            start_date: startDate,
            end_date: endDate,
            reason: values.reason || 'कोई कारण नहीं दिया गया',
            status: 'approved', // By default setting as approved
            leave_type: values.leave_type,
          };
          
          const { error: leaveError } = await supabase
            .from(`${type}_leave`)
            .insert(leaveData);
          
          if (leaveError) throw leaveError;
        } else {
          const leaveData: StaffLeave = {
            staff_id: personId,
            start_date: startDate,
            end_date: endDate,
            reason: values.reason || 'कोई कारण नहीं दिया गया',
            status: 'approved', // By default setting as approved
            leave_type: values.leave_type,
          };
          
          const { error: leaveError } = await supabase
            .from(`${type}_leave`)
            .insert(leaveData);
          
          if (leaveError) throw leaveError;
        }
      }
      
      // Create attendance records for each day in the range
      let currentDate = new Date(values.start_date);
      const lastDate = new Date(values.end_date);
      
      while (currentDate <= lastDate) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        
        if (type === 'trainee') {
          const attendanceData: TraineeAttendance = {
            trainee_id: personId,
            date: formattedDate,
            status: values.status,
          };
          
          const { error: attendanceError } = await supabase
            .from(`${type}_attendance`)
            .upsert(attendanceData);
          
          if (attendanceError) throw attendanceError;
        } else {
          const attendanceData: StaffAttendance = {
            staff_id: personId,
            date: formattedDate,
            status: values.status,
          };
          
          const { error: attendanceError } = await supabase
            .from(`${type}_attendance`)
            .upsert(attendanceData);
          
          if (attendanceError) throw attendanceError;
        }
        
        // Move to next day
        currentDate = addDays(currentDate, 1);
      }
      
      toast.success("अनुपस्थिति/अवकाश सफलतापूर्वक दर्ज किया गया");
      if (onSuccess) onSuccess();
      
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("फॉर्म जमा करने में त्रुटि हुई");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
}

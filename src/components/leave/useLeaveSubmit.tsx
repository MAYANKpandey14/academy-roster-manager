
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LeaveFormValues } from "./LeaveFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

interface UseLeaveSubmitParams {
  type: 'trainee' | 'staff';
  onSuccess: () => void;
}

export function useLeaveSubmit({ type, onSuccess }: UseLeaveSubmitParams) {
  const { isHindi } = useLanguage();
  
  const handleSubmit = async (data: LeaveFormValues) => {
    try {
      // First, find the trainee/staff
      const { data: person, error: findError } = await supabase
        .from(type === 'trainee' ? 'trainees' : 'staff')
        .select('id')
        .eq('pno', data.pno)
        .single();

      if (findError || !person) {
        toast.error(isHindi 
          ? (type === 'trainee' ? 'प्रशिक्षु नहीं मिला' : 'स्टाफ सदस्य नहीं मिला')
          : `${type === 'trainee' ? 'Trainee' : 'Staff member'} not found`);
        return;
      }

      const startDate = data.start_date;
      const endDate = data.end_date;

      // Insert leave record based on type
      if (type === 'trainee') {
        const { error: leaveError } = await supabase
          .from('trainee_leave')
          .insert({
            trainee_id: person.id,
            start_date: startDate,
            end_date: endDate,
            reason: data.reason,
            status: 'pending'
          });

        if (leaveError) throw leaveError;
      } else {
        const { error: leaveError } = await supabase
          .from('staff_leave')
          .insert({
            staff_id: person.id,
            start_date: startDate,
            end_date: endDate,
            reason: data.reason,
            status: 'pending'
          });

        if (leaveError) throw leaveError;
      }

      // Create attendance records for each day of leave
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        
        if (type === 'trainee') {
          await supabase
            .from('trainee_attendance')
            .upsert({
              trainee_id: person.id,
              date: formattedDate,
              status: 'on_leave'
            });
        } else {
          await supabase
            .from('staff_attendance')
            .upsert({
              staff_id: person.id,
              date: formattedDate,
              status: 'on_leave'
            });
        }
      }

      toast.success(isHindi ? "अवकाश अनुरोध सफलतापूर्वक जमा किया गया" : "Leave request submitted successfully");
      onSuccess();
      return true;
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error(isHindi ? "अवकाश अनुरोध जमा करने में विफल" : "Failed to submit leave request");
      return false;
    }
  };

  return { handleSubmit };
}

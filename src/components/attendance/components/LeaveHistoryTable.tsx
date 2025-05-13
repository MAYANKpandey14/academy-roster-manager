
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";
import { AttendanceRecord } from "../hooks/useFetchAttendance";

interface LeaveHistoryTableProps {
  personId: string;
  personType: 'trainee' | 'staff';
}

export function LeaveHistoryTable({ personId, personType }: LeaveHistoryTableProps) {
  const { isHindi } = useLanguage();
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['leave-history', personId, personType],
    queryFn: async () => {
      const functionName = personType === 'trainee' 
        ? 'trainee-attendance-view' 
        : 'staff-attendance-view';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { id: personId }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!personId,
  });

  if (error) {
    console.error("Error loading leave history:", error);
    return (
      <div className="p-4 text-red-500">
        <p className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "छुट्टी इतिहास लोड करने में त्रुटि" : "Error loading leave history"}
        </p>
      </div>
    );
  }

  // Format records for the table component
  const absences: AttendanceRecord[] = response?.attendance?.map((item: any) => ({
    id: `absence-${item.id}`,
    recordId: item.id,
    recordType: 'absence',
    date: item.date,
    type: 'absent',
    reason: item.status || '',
    approvalStatus: item.approval_status || 'pending',
    absenceType: 'absent'
  })) || [];

  const leaves: AttendanceRecord[] = response?.leave?.map((item: any) => ({
    id: `leave-${item.id}`,
    recordId: item.id,
    recordType: 'leave',
    date: `${item.start_date}${item.start_date !== item.end_date ? ` - ${item.end_date}` : ''}`,
    type: 'on_leave',
    reason: item.reason || '',
    leave_type: item.leave_type,
    approvalStatus: item.status || 'pending',
    absenceType: 'on_leave'
  })) || [];

  // Combine absences and leaves into a single records array
  const records = [...absences, ...leaves];

  return <LeaveHistoryTableContent records={records} isLoading={isLoading} />;
}

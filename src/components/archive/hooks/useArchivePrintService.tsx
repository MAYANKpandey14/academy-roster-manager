
import { useState } from "react";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { createStaffPrintContent } from "@/utils/export/staffPrintUtils";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint } from "@/utils/export/printUtils";
import { supabase } from "@/integrations/supabase/client";

export function useArchivePrintService() {
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();

  const fetchAttendanceData = async (personId: string, personType: 'staff' | 'trainee') => {
    try {
      const attendanceTable = personType === "staff" ? "staff_attendance" : "trainee_attendance";
      const leaveTable = personType === "staff" ? "staff_leave" : "trainee_leave";
      const idColumn = personType === "staff" ? "staff_id" : "trainee_id";

      console.log(`Fetching archive attendance data for ${personType} ID: ${personId}`);

      // Fetch attendance data
      const attendanceResult = await supabase
        .from(attendanceTable)
        .select("id, date, status, approval_status")
        .eq(idColumn, personId)
        .order("date", { ascending: false });

      // Fetch leave data
      const leaveResult = await supabase
        .from(leaveTable)
        .select("id, start_date, end_date, reason, status, leave_type")
        .eq(idColumn, personId)
        .order("start_date", { ascending: false });

      console.log("Archive attendance result:", attendanceResult);
      console.log("Archive leave result:", leaveResult);

      // Process attendance records with proper status parsing
      const attendanceRecords = (attendanceResult.data || []).map((record: any) => {
        let actualStatus = record.status;
        let reason = undefined;
        
        if (record.status && record.status.includes(": ")) {
          const parts = record.status.split(": ");
          actualStatus = parts[0];
          reason = parts.slice(1).join(": ");
        }
        
        return {
          id: record.id,
          date: record.date,
          status: actualStatus,
          approval_status: record.approval_status || "pending",
          person_id: personId,
          reason: reason
        };
      });

      // Process leave records
      const leaveRecords = (leaveResult.data || []).map((record: any) => ({
        id: record.id,
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason,
        status: record.status,
        leave_type: record.leave_type,
        approval_status: record.status || "pending",
        person_id: personId
      }));

      console.log("Processed archive attendance records:", attendanceRecords);
      console.log("Processed archive leave records:", leaveRecords);

      return {
        attendance: attendanceRecords,
        leave: leaveRecords
      };
    } catch (error) {
      console.error("Error fetching archive attendance data:", error);
      return { attendance: [], leave: [] };
    }
  };

  const handlePrintArchiveRecord = async (
    record: ArchivedStaff | ArchivedTrainee, 
    type: 'staff' | 'trainee'
  ) => {
    setIsLoading(true);
    try {
      console.log("Printing archive record:", record, "Type:", type);

      // Fetch complete attendance and leave data for the archived record
      const attendanceData = await fetchAttendanceData(record.id, type);

      let content = '';
      
      if (type === 'staff') {
        content = await createStaffPrintContent(
          [record as ArchivedStaff], 
          isHindi,
          attendanceData.attendance,
          attendanceData.leave
        );
      } else {
        content = await createPrintContent(
          [record as any], // Convert for compatibility
          isHindi,
          attendanceData.attendance,
          attendanceData.leave
        );
      }
      
      console.log("Generated print content length:", content.length);
      
      const success = handlePrint(content);
      
      if (success) {
        toast.success(isHindi ? "प्रिंट विंडो खोल दी गई है" : "Print window opened");
      } else {
        toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
      }
    } catch (error) {
      console.error("Error printing archive record:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePrintArchiveRecord
  };
}

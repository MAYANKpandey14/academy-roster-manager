
import { useState } from "react";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { createStaffPrintContent } from "@/utils/export/staffPrintUtils";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint } from "@/utils/export/printUtils";

export function useArchivePrintService() {
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();

  const handlePrintArchiveRecord = async (
    record: ArchivedStaff | ArchivedTrainee, 
    type: 'staff' | 'trainee'
  ) => {
    setIsLoading(true);
    try {
      console.log("Printing archive record:", record, "Type:", type);

      // Create empty attendance data as fallback
      const attendanceData = { attendance: [], leave: [] };

      let content = '';
      
      if (type === 'staff') {
        content = await createStaffPrintContent(
          [record as ArchivedStaff], 
          isHindi,
          attendanceData.attendance || [],
          attendanceData.leave || []
        );
      } else {
        content = await createPrintContent(
          [record as any], // Convert for compatibility
          isHindi,
          attendanceData.attendance || [],
          attendanceData.leave || []
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

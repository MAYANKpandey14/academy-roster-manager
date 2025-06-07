
import { useState } from "react";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint as utilHandlePrint } from "@/utils/export/printUtils";
import { exportTraineesToExcel } from "@/utils/export/traineeExcelUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";

export function useTraineePrintService(trainee: Trainee | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();
  const { data: attendanceData } = useFetchAttendance(trainee?.id || '', 'trainee');

  const handlePrint = async () => {
    if (!trainee) return;
    
    setIsLoading(true);
    try {
      const attendanceRecords = attendanceData?.attendance || [];
      const leaveRecords = attendanceData?.leave || [];

      const content = await createPrintContent([trainee], isHindi, attendanceRecords, leaveRecords);
      utilHandlePrint(content);
      
      toast.success(isHindi ? "प्रिंट विंडो खोल दी गई है" : "Print window opened");
    } catch (error) {
      console.error("Error printing:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExcelExport = () => {
    if (!trainee) return;
    
    setIsLoading(true);
    try {
      // Export a single trainee with all fields
      exportTraineesToExcel([trainee], isHindi, true);
      
      // Show success toast
      toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "Excel file downloaded successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error(isHindi ? "एक्सेल फ़ाइल बनाते समय त्रुटि हुई" : "Error creating Excel file");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handlePrint,
    handleExcelExport
  };
}

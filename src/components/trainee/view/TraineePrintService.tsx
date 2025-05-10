
import { useState } from "react";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint } from "@/utils/export/printUtils";
import { exportTraineesToExcel } from "@/utils/export/traineeExcelUtils";
import { useLanguage } from "@/contexts/LanguageContext";

export function useTraineePrintService(trainee: Trainee) {
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();

  const handlePrint = () => {
    setIsLoading(true);
    try {
      const content = createPrintContent([trainee], isHindi);
      const success = window.open("", "_blank")?.document.write(content);
      
      if (success) {
        toast.success(isHindi ? "प्रिंट विंडो खोल दी गई है" : "Print window opened");
      } else {
        toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window");
      }
    } catch (error) {
      console.error("Error printing:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExcelExport = () => {
    setIsLoading(true);
    try {
      // Export a single trainee with all fields
      const success = exportTraineesToExcel([trainee], isHindi, true);
      
      if (success) {
        toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "Excel file downloaded successfully");
      } else {
        toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
      }
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

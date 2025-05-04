
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { createCSVContent } from "@/utils/export/traineeCSVUtils";
import { handlePrint as printUtil, handleDownload } from "@/utils/export/printUtils";
import { exportTraineesToExcel } from "@/utils/export";

export interface TraineePrintServiceProps {
  trainee: Trainee;
}

export function useTraineePrintService(trainee: Trainee) {
  const { isHindi } = useLanguage();

  const handlePrint = () => {
    // Generate print content 
    const printContent = createPrintContent([trainee], isHindi);
    
    // Print the content
    const printSuccess = printUtil(printContent);
    
    if (!printSuccess) {
      toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window");
    } else {
      toast.success(isHindi ? "ट्रेनी विवरण प्रिंट हो रहा है..." : "Printing trainee details");
    }
  };

  const handleDownloadTrainee = () => {
    const csvContent = createCSVContent([trainee], isHindi);
    
    const filename = `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`;
    handleDownload(csvContent, filename);
    
    toast.success(isHindi ? "ट्रेनी CSV सफलतापूर्वक डाउनलोड हो गया" : "Trainee CSV downloaded successfully");
  };

  const handleExcelExport = () => {
    const success = exportTraineesToExcel([trainee], isHindi, false);
    
    if (success) {
      toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "Excel file downloaded successfully");
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  };

  return {
    handlePrint,
    handleDownloadTrainee,
    handleExcelExport
  };
}

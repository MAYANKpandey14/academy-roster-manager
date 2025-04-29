
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";

export function useTraineePrintService(trainee: Trainee) {
  const handlePrintTrainee = () => {
    if (!trainee) {
      toast.error("प्रशिक्षु विवरण उपलब्ध नहीं है");
      return;
    }
    
    const printContent = createPrintContent(trainee);
    const success = handlePrint(printContent);
    
    if (success) {
      toast.success("प्रशिक्षु का प्रिंट हो रहा है");
    } else {
      toast.error("प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।");
    }
  };
  
  const handleDownloadTrainee = () => {
    if (!trainee) {
      toast.error("प्रशिक्षु विवरण उपलब्ध नहीं है");
      return;
    }
    
    const csvContent = createCSVContent(trainee);
    const filename = `trainee_${trainee.pno}_${new Date().toISOString().split('T')[0]}.csv`;
    
    handleDownload(csvContent, filename);
    toast.success("प्रशिक्षु CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई");
  };
  
  return { handlePrintTrainee, handleDownloadTrainee };
}

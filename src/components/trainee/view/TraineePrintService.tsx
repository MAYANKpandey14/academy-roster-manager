
import { Trainee } from "@/types/trainee";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

export function useTraineePrintService(trainee: Trainee) {
  const { t } = useTranslation();

  const handlePrintTrainee = () => {
    const printContent = createPrintContent([trainee], t);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error("प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।");
    } else {
      toast.success("प्रशिक्षु विवरण प्रिंट हो रहा है");
    }
  };

  const handleDownloadTrainee = () => {
    const csvContent = createCSVContent([trainee], t);
    handleDownload(
      csvContent, 
      `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success("सीएसवी फ़ाइल सफलतापूर्वक डाउनलोड की गई");
  };

  return {
    handlePrintTrainee,
    handleDownloadTrainee
  };
}

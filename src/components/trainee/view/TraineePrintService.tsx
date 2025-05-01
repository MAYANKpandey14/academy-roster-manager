import { Trainee } from "@/types/trainee";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface TraineePrintServiceProps {
  trainee: Trainee;
}

export function useTraineePrintService(trainee: Trainee) {
  const { isHindi } = useLanguage();
  
  // Create a translation function that matches the expected type
  const t = (key: string, fallback: string) => {
    const translations: Record<string, string> = {
      printError: isHindi ? "ट्रेनी विवरण प्रिंट हो रहा है..." : "Failed to open print window. Please check your pop-up blocker settings.",
      printSuccess: isHindi ? "ट्रेनी विवरण प्रिंट हो रहा है..." : "Printing trainee details",
      downloadSuccess: isHindi ? "CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully",
      traineeInfo: isHindi ? "आरटीसी प्रशिक्षु जानकारी" : "RTC Trainee Information",
      rtcPolice: isHindi ? "आरटीसी पुलिस लाइन, मुरादाबाद" : "RTC POLICE LINE, MORADABAD",
      name: isHindi ? "नाम" : "Name",
      pno: isHindi ? "पीएनओ" : "PNO",
      chestNo: isHindi ? "चेस्ट नंबर" : "Chest No",
      fatherName: isHindi ? "पिता का नाम" : "Father's Name",
      dateOfBirth: isHindi ? "जन्म तिथि" : "Date of Birth",
      dateOfJoining: isHindi ? "शामिल होने की तिथि" : "Date of Joining",
      trainingPeriod: isHindi ? "प्रशिक्षण अवधि" : "Training Period",
      trainingPeriodTo: isHindi ? "से" : "to",
      currentPosting: isHindi ? "वर्तमान पोस्टिंग" : "Current Posting",
      mobile: isHindi ? "मोबाइल" : "Mobile",
      education: isHindi ? "शिक्षा" : "Education",
      bloodGroup: isHindi ? "रक्त समूह" : "Blood Group",
      nominee: isHindi ? "नौमिनी " : "Nominee",
      homeAddress: isHindi ? "घर का पता" : "Home Address",
      documentGenerated: isHindi ? "यह दस्तावेज़ बनाया गया था" : "This document was generated on"
    };
    return translations[key] || fallback;
  };

  const handlePrintTrainee = () => {
    const printContent = createPrintContent([trainee], isHindi);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error(t('printError', 'Failed to open print window'));
    } else {
      toast.success(t('printSuccess', 'Printing trainee details'));
    }
  };

  const handleDownloadTrainee = () => {
    const csvContent = createCSVContent([trainee], isHindi);
    handleDownload(
      csvContent, 
      `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(isHindi ? "CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "CSV file downloaded successfully");
  };

  return {
    handlePrintTrainee,
    handleDownloadTrainee
  };
}

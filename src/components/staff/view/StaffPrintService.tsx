
import { Staff } from "@/types/staff";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StaffPrintServiceProps {
  staff: Staff;
}

export function useStaffPrintService(staff: Staff) {
  const { isHindi } = useLanguage();
  // Use isHindi directly to determine language
  const currentLanguage = isHindi ? 'hi' : 'en';

  const handlePrintStaff = () => {
    const printContent = createStaffPrintContent([staff], currentLanguage);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
    } else {
      toast.success(isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details");
    }
  };

  const handleDownloadStaff = () => {
    const csvContent = createStaffCSVContent([staff], currentLanguage);
    handleDownload(
      csvContent, 
      `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
  };

  return {
    handlePrintStaff,
    handleDownloadStaff
  };
}

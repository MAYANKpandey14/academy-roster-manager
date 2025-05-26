
import { Staff } from "@/types/staff";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";
import { handlePrint, handleDownload, exportStaffToExcel } from "@/utils/export";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StaffPrintServiceProps {
  staff: Staff;
}

export function useStaffPrintService(staff: Staff) {
  const { isHindi } = useLanguage();
  // Use isHindi directly to determine language
  const currentLanguage = isHindi ? 'hi' : 'en';

  const handlePrintStaff = async () => {
    // Ensure the staff object has the photo_url property before printing
    const staffWithPhoto = {
      ...staff,
      photo_url: staff.photo_url || null
    };
    
    try {
      const printContent = await createStaffPrintContent([staffWithPhoto], isHindi);
      const printSuccess = handlePrint(printContent);
      
      if (!printSuccess) {
        toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
      } else {
        toast.success(isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details");
      }
    } catch (error) {
      console.error("Error printing staff:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    }
  };

  const handleDownloadStaff = () => {
    const csvContent = createStaffCSVContent([staff], isHindi);
    handleDownload(
      csvContent, 
      `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
  };

  const handleExcelExport = () => {
    const success = exportStaffToExcel([staff], isHindi);
    
    if (success) {
      toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "Excel file downloaded successfully");
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  };

  return {
    handlePrintStaff,
    handleDownloadStaff,
    handleExcelExport
  };
}


import { Staff } from "@/types/staff";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StaffPrintServiceProps {
  staff: Staff;
}

export function useStaffPrintService(staff: Staff) {
  const { t } = useTranslation();
  const { isHindi } = useLanguage();
  // Use isHindi directly instead of currentLanguage
  const currentLanguage = isHindi ? 'hi' : 'en';

  const handlePrintStaff = () => {
    const printContent = createPrintContent([staff], currentLanguage, t);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error(t("failedToPrint", "Failed to open print window. Please check your pop-up blocker settings."));
    } else {
      toast.success(t("printingStaff", `Printing staff details`));
    }
  };

  const handleDownloadStaff = () => {
    const csvContent = createCSVContent([staff], currentLanguage, t);
    handleDownload(
      csvContent, 
      `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(t("csvDownloaded", "CSV file downloaded successfully"));
  };

  return {
    handlePrintStaff,
    handleDownloadStaff
  };
}

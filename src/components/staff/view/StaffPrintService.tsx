
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { 
  createStaffPrintContent, 
  createStaffCSVContent, 
  handlePrint, 
  handleDownload 
} from "@/utils/staffExportUtils";

interface StaffPrintServiceProps {
  staff: Staff;
}

export function useStaffPrintService(staff: Staff | null) {
  const { t, i18n } = useTranslation();

  const handlePrintStaff = () => {
    if (!staff) return;
    
    const content = createStaffPrintContent([staff], i18n.language, t);
    const success = handlePrint(content);
    
    if (success) {
      toast.success(t("printingStaff", "Printing staff details"));
    } else {
      toast.error(t("printingError", "Could not open print dialog"));
    }
  };

  const handleDownloadStaff = () => {
    if (!staff) return;
    
    const content = createStaffCSVContent([staff], i18n.language, t);
    const success = handleDownload(
      content, 
      `staff_${staff.pno}_${new Date().toISOString().split('T')[0]}.csv`
    );
    
    if (success) {
      toast.success(t("staffCSVDownloaded", "Staff details downloaded as CSV"));
    } else {
      toast.error(t("downloadError", "Could not download file"));
    }
  };

  return {
    handlePrintStaff,
    handleDownloadStaff,
  };
}

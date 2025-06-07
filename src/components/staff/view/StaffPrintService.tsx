
import { Staff } from "@/types/staff";
import { createStaffPrintContent, createStaffCSVContent, exportStaffToExcel } from "@/utils/staffExportUtils";
import { handlePrint as utilHandlePrint, handleDownload } from "@/utils/export/printUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";

export interface StaffPrintServiceProps {
  staff: Staff | null;
}

export function useStaffPrintService(staff: Staff | null) {
  const { isHindi } = useLanguage();
  
  // Only fetch attendance data if staff is available
  const { data: attendanceData } = useFetchAttendance(
    staff?.id || '', 
    'staff'
  );

  const handlePrintStaff = async () => {
    if (!staff) {
      toast.error(isHindi ? "स्टाफ डेटा लोड नहीं हुआ है" : "Staff data not loaded");
      return;
    }

    // Ensure the staff object has the photo_url property before printing
    const staffWithPhoto = {
      ...staff,
      photo_url: staff.photo_url || null
    };
    
    try {
      const attendanceRecords = attendanceData?.attendance || [];
      const leaveRecords = attendanceData?.leave || [];

      const printContent = await createStaffPrintContent([staffWithPhoto], isHindi, attendanceRecords, leaveRecords);
      utilHandlePrint(printContent);
      
      toast.success(isHindi ? "प्रिंट विंडो खोल दी गई है" : "Print window opened");
    } catch (error) {
      console.error("Error printing staff:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    }
  };

  const handleDownloadStaff = () => {
    if (!staff) {
      toast.error(isHindi ? "स्टाफ डेटा लोड नहीं हुआ है" : "Staff data not loaded");
      return;
    }

    const csvContent = createStaffCSVContent([staff], isHindi);
    handleDownload(
      csvContent, 
      `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
  };

  const handleExcelExport = () => {
    if (!staff) {
      toast.error(isHindi ? "स्टाफ डेटा लोड नहीं हुआ है" : "Staff data not loaded");
      return;
    }

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

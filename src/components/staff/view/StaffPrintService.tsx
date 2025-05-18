
import { useState } from "react";
import { Staff } from "@/types/staff";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";
import { handlePrint, handleDownload, exportStaffToExcel } from "@/utils/export";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";
import { createPersonWithAttendancePrintContent } from "@/utils/export/attendancePrintUtils";

export interface StaffPrintServiceProps {
  staff: Staff | null;
}

export function useStaffPrintService(staff: Staff | null) {
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();
  
  // Fetch attendance records for the staff if available
  const { 
    records: attendanceRecords, 
    isLoading: attendanceLoading, 
    error: attendanceError 
  } = staff?.id ? 
    useFetchAttendance(staff.id, 'staff') : 
    { records: [], isLoading: false, error: null };

  const handlePrintStaff = () => {
    if (!staff) return;
    
    setIsLoading(true);
    try {
      // Ensure the staff object has the photo_url property before printing
      const staffWithPhoto = {
        ...staff,
        photo_url: staff.photo_url || null
      };
      
      // Use the enhanced print format that includes attendance records
      if (attendanceRecords.length > 0) {
        const content = createPersonWithAttendancePrintContent(
          staffWithPhoto,
          'staff',
          attendanceRecords,
          isHindi
        );
        const printSuccess = handlePrint(content);
        
        if (!printSuccess) {
          toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
        } else {
          toast.success(isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details");
        }
      } else {
        // Fallback to original print format if no attendance records
        const printContent = createStaffPrintContent([staffWithPhoto], isHindi);
        const printSuccess = handlePrint(printContent);
        
        if (!printSuccess) {
          toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
        } else {
          toast.success(isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details");
        }
      }
    } catch (error) {
      console.error("Error printing staff:", error);
      toast.error(isHindi ? "प्रिंट करते समय त्रुटि हुई" : "Error while printing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadStaff = () => {
    if (!staff) return;
    
    setIsLoading(true);
    try {
      const csvContent = createStaffCSVContent([staff], isHindi);
      handleDownload(
        csvContent, 
        `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
      );
      toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
    } catch (error) {
      console.error("Error downloading staff CSV:", error);
      toast.error(isHindi ? "CSV फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelExport = () => {
    if (!staff) return;
    
    setIsLoading(true);
    try {
      const success = exportStaffToExcel([staff], isHindi);
      
      if (success) {
        toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : "Excel file downloaded successfully");
      } else {
        toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePrintStaff,
    handleDownloadStaff,
    handleExcelExport,
    isLoading: isLoading || attendanceLoading
  };
}

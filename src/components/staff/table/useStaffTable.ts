import { useState, useEffect } from "react";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { deleteStaff } from "@/services/staffApi";
import { handlePrint, handleDownload } from "@/utils/export";
import { useLanguage } from "@/contexts/LanguageContext";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";

export function useStaffTable(staff: Staff[], onRefresh: () => void) {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const { isHindi } = useLanguage();

  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const handleDelete = async (id: string) => {
    if (confirm(isHindi ? "क्या आप इस स्टाफ सदस्य को हटाना चाहते हैं?" : "Are you sure you want to delete this staff member?")) {
      try {
        const { error } = await deleteStaff(id);
        
        if (error) throw error;
        
        toast.success(isHindi ? "स्टाफ सफलतापूर्वक हटाया गया" : "Staff deleted successfully");
        onRefresh();
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error(isHindi ? "स्टाफ हटाने में विफल" : "Failed to delete staff");
      }
    }
  };

  const getSelectedStaff = (): Staff[] => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => staff[index]);
  };

  const handlePrintAction = (staffToPrint: Staff[] = []) => {
    const selectedStaff = staffToPrint.length ? staffToPrint : getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक स्टाफ सदस्य चुनें" : "Please select at least one staff member to print");
      return;
    }
    
    const content = createStaffPrintContent(selectedStaff, isHindi);
    handlePrint(content);
    toast.success(isHindi ? "स्टाफ प्रिंट हो रहा है..." : "Printing staff member(s)");
  };

  const handleDownloadAction = (staffToDownload: Staff[] = []) => {
    const selectedStaff = staffToDownload.length ? staffToDownload : getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक स्टाफ सदस्य चुनें" : "Please select at least one staff member to download");
      return;
    }
    
    const content = createStaffCSVContent(selectedStaff, isHindi);
    handleDownload(content, `selected_staff_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
  };

  

  return {
    rowSelection,
    setRowSelection,
    selectedCount,
    handleDelete,
    handlePrintAction,
    handleDownloadAction,
    getSelectedStaff
  };
}

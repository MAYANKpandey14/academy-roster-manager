
import { useState, useEffect } from "react";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteStaff } from "@/services/staffApi";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";

export function useStaffTable(staff: Staff[], onRefresh: () => void) {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const handleDelete = async (id: string) => {
    if (confirm(t("confirm", "Are you sure you want to delete this staff member?"))) {
      try {
        const { error } = await deleteStaff(id);
        
        if (error) throw error;
        
        toast.success(t("success", "Staff deleted successfully"));
        onRefresh();
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error(t("failure", "Failed to delete staff"));
      }
    }
  };

  function getSelectedStaff(): Staff[] {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => staff[index]);
  }

  function handlePrintAction(staffToPrint: Staff[] = []) {
    const selectedStaff = staffToPrint.length ? staffToPrint : getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(t("selectTraineesToPrint", "Please select at least one staff member to print"));
      return;
    }
    
    const content = createStaffPrintContent(selectedStaff, i18n.language, t);
    handlePrint(content);
    toast.success(t("printingStaff", `Printing ${selectedStaff.length} staff member(s)`));
  }

  function handleDownloadAction(staffToDownload: Staff[] = []) {
    const selectedStaff = staffToDownload.length ? staffToDownload : getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(t("selectTraineesToDownload", "Please select at least one staff member to download"));
      return;
    }
    
    const content = createStaffCSVContent(selectedStaff, i18n.language, t);
    handleDownload(content, `selected_staff_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(t("staffCSVDownloaded", `CSV file with ${selectedStaff.length} staff member(s) downloaded successfully`));
  }

  return {
    rowSelection,
    setRowSelection,
    selectedCount,
    handleDelete,
    handlePrintAction,
    handleDownloadAction
  };
}


import { useState } from "react";
import { Staff } from "@/types/staff";
import { DataTable } from "@/components/ui/data-table";
import { getStaffColumns } from "./table/StaffTableColumns";
import { StaffTableActions } from "./table/StaffTableActions";
import { useStaffTable } from "./table/useStaffTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportStaffToExcel } from "@/utils/export";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";
import { handlePrint, handleDownload } from "@/utils/export";
import { toast } from "sonner";

interface StaffTableProps {
  staff: Staff[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StaffTable = ({ staff, onRefresh, isLoading = false }: StaffTableProps) => {
  const { isHindi } = useLanguage();
  
  const {
    rowSelection,
    setRowSelection,
    selectedCount,
    handleDelete,
    getSelectedStaff
  } = useStaffTable(staff, onRefresh);

  // Define proper print action implementation
  const handlePrintAction = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      console.log("Printing staff:", staffId);
      // Ensure the staff object has the photo_url property before printing
      const staffWithPhoto = {
        ...staffMember,
        photo_url: staffMember.photo_url || null
      };
      
      const printContent = createStaffPrintContent([staffWithPhoto], isHindi);
      const printSuccess = handlePrint(printContent);
      
      if (!printSuccess) {
        toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
      } else {
        toast.success(isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details");
      }
    }
  };

  const handleDownloadAction = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      console.log("Downloading staff:", staffId);
      const csvContent = createStaffCSVContent([staffMember], isHindi);
      handleDownload(
        csvContent, 
        `staff_${staffMember.pno}_${staffMember.name.replace(/\s+/g, '_')}.csv`
      );
      toast.success(isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully");
    }
  };

  const handleExcelExport = (staffMember: Staff) => {
    if (!staffMember) return;
    exportStaffToExcel([staffMember], isHindi);
  };
  
  const columns = getStaffColumns(
    isHindi, 
    isLoading, 
    handlePrintAction,
    handleDownloadAction,
    null, // Pass null instead of handleDelete to remove delete functionality
    handleExcelExport
  );

  return (
    <div className="space-y-4">
      <StaffTableActions
        staff={staff}
        selectedCount={selectedCount}
        getSelectedStaff={getSelectedStaff}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />
      
      <DataTable
        columns={columns}
        data={staff}
        filterColumn="name"
        filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        totalLabel={isHindi ? "कुल स्टाफ" : "Total Staff"}
      />
    </div>
  );
};

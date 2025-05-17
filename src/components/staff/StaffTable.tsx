
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
    handlePrintAction,
    handleDownloadAction,
    getSelectedStaff
  } = useStaffTable(staff, onRefresh);

  const handleExcelExport = (staffMember: Staff) => {
    if (!staffMember) return;
    exportStaffToExcel([staffMember], isHindi);
  };
  
  // Adapter functions to convert between types for print/download actions
  const handlePrintStaff = (staffId: string) => {
    const staffToPrint = staff.find(s => s.id === staffId);
    if (staffToPrint) {
      handlePrintAction([staffToPrint]);
    }
  };

  const handleDownloadStaff = (staffId: string) => {
    const staffToDownload = staff.find(s => s.id === staffId);
    if (staffToDownload) {
      handleDownloadAction([staffToDownload]);
    }
  };
  
  const columns = getStaffColumns(
    isHindi, 
    isLoading, 
    handlePrintStaff,
    handleDownloadStaff,
    onRefresh, // Pass onRefresh as handleDelete
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

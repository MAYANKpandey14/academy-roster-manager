import { useState } from "react";
import { Staff } from "@/types/staff";
import { DataTable } from "@/components/ui/data-table";
import { getStaffColumns } from "./table/StaffTableColumns";
import { StaffTableActions } from "./table/StaffTableActions";
import { useStaffTable } from "./table/useStaffTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportStaffToExcel } from "@/utils/export";

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
    handlePrintAction,
    handleDownloadAction,
    getSelectedStaff
  } = useStaffTable(staff, onRefresh);

  const handleExcelExport = (staffToExport: Staff[] = []) => {
    const selectedStaff = staffToExport.length ? staffToExport : getSelectedStaff();
    if (selectedStaff.length === 0) {
      // Optionally show a toast here
      return;
    }
    exportStaffToExcel(selectedStaff, isHindi, selectedStaff.length > 1);
  };
  
  const columns = getStaffColumns(
    isHindi, 
    isLoading, 
    handlePrintAction,
    handleDownloadAction,
    handleDelete,
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

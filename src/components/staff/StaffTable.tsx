    
import { useState } from "react";
import { Staff } from "@/types/staff";
import { DataTable } from "@/components/ui/data-table";
import { getStaffColumns } from "./table/StaffTableColumns";
import { StaffTableActions } from "./table/StaffTableActions";
import { useStaffTable } from "./table/useStaffTable";
import { useLanguage } from "@/contexts/LanguageContext";

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
    handleDownloadAction
  } = useStaffTable(staff, onRefresh);

  const columns = getStaffColumns(
    isHindi, 
    isLoading, 
    handlePrintAction,
    handleDownloadAction,
    handleDelete
  );

  return (
    <div className="space-y-4">
      <StaffTableActions
        selectedCount={selectedCount}
        handlePrintAction={() => handlePrintAction()}
        handleDownloadAction={() => handleDownloadAction()}
        isLoading={isLoading}
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


import { useState } from "react";
import { Staff } from "@/types/staff";
import { DataTable } from "@/components/ui/data-table";
import { useTranslation } from "react-i18next";
import { staffColumns } from "./table/StaffTableColumns";
import { StaffTableActions } from "./table/StaffTableActions";
import { useStaffTable } from "./table/useStaffTable";

interface StaffTableProps {
  staff: Staff[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StaffTable = ({ staff, onRefresh, isLoading = false }: StaffTableProps) => {
  const { t, i18n } = useTranslation();
  
  const {
    rowSelection,
    setRowSelection,
    selectedCount,
    handleDelete,
    handlePrintAction,
    handleDownloadAction
  } = useStaffTable(staff, onRefresh);

  return (
    <div className="space-y-4">
      <StaffTableActions
        selectedCount={selectedCount}
        handlePrintAction={() => handlePrintAction()}
        handleDownloadAction={() => handleDownloadAction()}
        isLoading={isLoading}
      />
      
      <DataTable
        columns={staffColumns}
        data={staff}
        filterColumn="name"
        filterPlaceholder={t("searchByName", "नाम से खोजें...")}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        totalLabel="totalStaff"
      />
    </div>
  );
};

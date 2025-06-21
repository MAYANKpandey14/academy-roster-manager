
import { useState, useMemo } from "react";
import { Staff } from "@/types/staff";
import { DataTable } from "@/components/ui/data-table";
import { getStaffColumns } from "./table/StaffTableColumns";
import { StaffTableActions } from "./table/StaffTableActions";
import { EnhancedStaffSortBy } from "./table/EnhancedStaffSortBy";
import { useStaffTable } from "./table/useStaffTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { exportStaffToExcel } from "@/utils/export";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";
import { handlePrint, handleDownload } from "@/utils/export";
import { toast } from "sonner";
import { ActiveFilters } from "@/components/common/ActiveFilters";
import { useStaffFilters } from "./hooks/useStaffFilters";

interface StaffTableProps {
  staff: Staff[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StaffTable = ({ staff, onRefresh, isLoading = false }: StaffTableProps) => {
  const { isHindi } = useLanguage();
  
  const {
    sortBy,
    setSortBy,
    getActiveFilters,
    handleRemoveFilter,
    handleResetAll
  } = useStaffFilters();
  
  const {
    rowSelection,
    setRowSelection,
    selectedCount,
    handlePrintAction,
    handleDownloadAction,
    getSelectedStaff
  } = useStaffTable(staff, onRefresh);

  // Enhanced sort staff based on selected sort option
  const sortedStaff = useMemo(() => {
    const staffCopy = [...staff];
    
    if (!sortBy || sortBy === "") {
      return staffCopy; // Return unsorted if no sort option selected
    }
    
    if (sortBy.startsWith("rank:")) {
      const targetRank = sortBy.replace("rank:", "");
      // Use exact match instead of partial match
      return staffCopy.filter(s => s.rank === targetRank);
    }
    
    return staffCopy.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "pno":
          return a.pno.localeCompare(b.pno);
        case "rank":
          return a.rank.localeCompare(b.rank);
        case "district":
          return a.current_posting_district.localeCompare(b.current_posting_district);
        case "mobile":
          return a.mobile_number.localeCompare(b.mobile_number);
        default:
          return 0;
      }
    });
  }, [staff, sortBy]);

  const handleExcelExport = (staffMember: Staff) => {
    if (!staffMember) return;
    exportStaffToExcel([staffMember], isHindi);
  };
  
  // Adapter functions to convert between types for print/download actions
  const handlePrintStaff = (staffId: string) => {
    const staffToPrint = sortedStaff.find(s => s.id === staffId);
    if (staffToPrint) {
      handlePrintAction([staffToPrint]);
    }
  };

  const handleDownloadStaff = (staffId: string) => {
    const staffToDownload = sortedStaff.find(s => s.id === staffId);
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
    handleExcelExport,
    onRefresh // Pass onRefresh as handleArchive
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <EnhancedStaffSortBy onSortChange={setSortBy} currentSort={sortBy} />
        
        <StaffTableActions
          staff={sortedStaff}
          selectedCount={selectedCount}
          getSelectedStaff={getSelectedStaff}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </div>

      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onResetAll={handleResetAll}
      />
      
      <DataTable
        columns={columns}
        data={sortedStaff}
        filterColumn="name"
        filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        totalLabel={isHindi ? "कुल स्टाफ" : "Total Staff"}
        enableRankFilter={true}
        rankFilterPlaceholder={isHindi ? "रैंक से फिल्टर करें..." : "Filter by rank..."}
      />
    </div>
  );
};

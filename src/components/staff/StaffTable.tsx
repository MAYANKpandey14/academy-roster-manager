
import { useState, useEffect } from "react";
import { Staff, StaffRank } from "@/types/staff";
import { 
  ColumnDef, 
  ColumnFiltersState,
  SortingState, 
  VisibilityState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { deleteStaff } from "@/services/staffApi";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import { prepareTextForLanguage } from "@/utils/textUtils";

interface StaffTableProps {
  staff: Staff[];
  onRefresh: () => void;
  isLoading?: boolean;
}

export const StaffTable = ({ staff, onRefresh, isLoading = false }: StaffTableProps) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCount, setSelectedCount] = useState(0);
  const isMobile = useIsMobile();
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

  const columns: ColumnDef<Staff>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() 
              ? true 
              : table.getIsSomePageRowsSelected() 
                ? "indeterminate" 
                : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          disabled={isLoading}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isLoading}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pno",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("pno", "PNO")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("pno") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>{value}</span>;
      }
    },
    {
      accessorKey: "name",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("name", "Name")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''} font-medium`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "rank",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("rank", "Rank")}
        </span>
      },
      cell: ({ row }) => {
        const rank = row.getValue("rank") as StaffRank;
        return (
          <Badge 
            variant={
              rank === "Instructor" || rank === "ITI" || rank === "PTI" || rank === "SI(Teacher)" 
                ? "default" 
                : "outline"
            }
          >
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {rank}
            </span>
          </Badge>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("postingDistrict", "Posting District")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("current_posting_district") as string;
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {prepareTextForLanguage(value, i18n.language)}
        </span>;
      }
    },
    {
      accessorKey: "mobile_number",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("mobile", "Mobile")}
        </span>
      },
      cell: ({ row }) => {
        const value = row.getValue("mobile_number") as string;
        return <span>{value}</span>;
      }
    },
    {
      id: "actions",
      header: () => {
        return <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("actions", "Actions")}
        </span>
      },
      cell: ({ row }) => {
        const staff = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/view-staff/${staff.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("view", "View")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/edit-staff/${staff.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("edit", "Edit")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintAction([staff])}>
                <Printer className="mr-2 h-4 w-4" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("print", "Print")}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadAction([staff])}>
                <Download className="mr-2 h-4 w-4" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("download", "Download")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePrintAction()}
          className="print-button"
          disabled={isLoading || selectedCount === 0}
        >
          <Printer className="h-4 w-4" />
          {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("printSelected", "Print Selected")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </span>}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownloadAction()}
          className="download-button"
          disabled={isLoading || selectedCount === 0}
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("downloadCSV", "Download CSV")}{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </span>}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={staff}
        filterColumn="name"
        filterPlaceholder={t("searchByName", "Search by name...")}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        totalLabel="totalStaff"
      />
    </div>
  );
};

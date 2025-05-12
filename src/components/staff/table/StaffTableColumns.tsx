
import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "@/types/staff";
import { Checkbox } from "@/components/ui/checkbox";
import { StaffRowActions } from "./StaffRowActions";

export function getStaffColumns(
  isHindi: boolean, 
  isLoading: boolean,
  handlePrintAction?: (staffId: string) => void,
  handleDownloadAction?: (staffId: string) => void,
  handleDelete?: (staffId: string) => void,
  handleExcelExport?: (staff: Staff) => void,
  onDeleteSuccess?: () => void
): ColumnDef<Staff>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "pno",
      header: isHindi ? "पीएनओ" : "PNO",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("pno")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
    },
    {
      accessorKey: "rank",
      header: isHindi ? "रैंक" : "Rank",
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting",
    },
    {
      accessorKey: "mobile_number",
      header: isHindi ? "मोबाइल नंबर" : "Mobile",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <StaffRowActions
            staff={row.original}
            handlePrintAction={handlePrintAction}
            handleDownloadAction={handleDownloadAction}
            handleDelete={handleDelete}
            handleExcelExport={handleExcelExport}
            onDeleteSuccess={onDeleteSuccess}
          />
        );
      },
    },
  ];
}

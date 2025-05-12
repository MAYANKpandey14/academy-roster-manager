
import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "@/types/staff";
import { StaffRowActions } from "./StaffRowActions";
import { format } from "date-fns";

export function getStaffColumns(
  isHindi: boolean,
  isLoading: boolean,
  handlePrintAction?: (staffId: string) => void,
  handleDownloadAction?: (staffId: string) => void,
  handleDelete?: (staffId: string) => void,
  handleExcelExport?: (staff: Staff) => void,
  onRefresh?: () => void
): ColumnDef<Staff>[] {
  return [
    {
      accessorKey: "pno",
      header: isHindi ? "पीएनओ" : "PNO",
      cell: ({ row }) => <div className="font-medium">{row.getValue("pno")}</div>,
    },
    {
      accessorKey: "name",
      header: isHindi ? "नाम" : "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "rank",
      header: isHindi ? "रैंक" : "Rank",
    },
    {
      accessorKey: "current_posting_district",
      header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("current_posting_district")}</div>
      ),
    },
    {
      accessorKey: "mobile_number",
      header: isHindi ? "मोबाइल नंबर" : "Mobile Number",
    },
    {
      accessorKey: "date_of_joining",
      header: isHindi ? "शामिल होने की तिथि" : "Date of Joining",
      cell: ({ row }) => {
        const date = row.getValue("date_of_joining") as string;
        if (!date) return "-";
        return format(new Date(date), "dd/MM/yyyy");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <StaffRowActions 
            staff={row.original}
            handlePrintAction={handlePrintAction}
            handleDownloadAction={handleDownloadAction}
            handleExcelExport={handleExcelExport}
            handleDelete={handleDelete}
            onRefresh={onRefresh}
          />
        );
      },
    },
  ];
}

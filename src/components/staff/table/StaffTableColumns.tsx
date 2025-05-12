
import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "@/types/staff";
import { StaffRowActions } from "./StaffRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const getStaffColumns = (
  isHindi: boolean,
  isLoading: boolean,
  handlePrint?: (staffId: string) => void,
  handleDownload?: (staffId: string) => void,
  handleDelete?: (staffId: string) => void,
  handleExcelExport?: (staff: Staff) => void
): ColumnDef<Staff>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && true)
        }
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
        className="h-4 w-4 rounded border-gray-300"
        disabled={isLoading}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => {
          row.toggleSelected(!!e.target.checked);
        }}
        aria-label="Select row"
        className="h-4 w-4 rounded border-gray-300"
        disabled={isLoading}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "photo_url",
    header: isHindi ? "फोटो" : "Photo",
    cell: ({ row }) => {
      const staff = row.original;
      const firstLetter = staff.name.charAt(0).toUpperCase();
      
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={staff.photo_url} alt={staff.name} />
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "pno",
    header: "PNO",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("pno")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: isHindi ? "नाम" : "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "rank",
    header: isHindi ? "रैंक" : "Rank",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "current_posting_district",
    header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
  },
  {
    accessorKey: "mobile_number",
    header: isHindi ? "मोबाइल नंबर" : "Mobile Number",
    cell: ({ row }) => <div>{row.getValue("mobile_number")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;
      
      return (
        <StaffRowActions
          staff={staff}
          handlePrintAction={handlePrint}
          handleDownloadAction={handleDownload}
          handleExcelExport={handleExcelExport ? () => handleExcelExport(staff) : undefined}
          handleDelete={handleDelete}
        />
      );
    },
  },
];

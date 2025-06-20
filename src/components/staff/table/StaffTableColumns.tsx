
import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "@/types/staff";
import { StaffRowActions } from "./StaffRowActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tokenExactMatchFilter } from "@/lib/filters";

export const getStaffColumns = (
  isHindi: boolean,
  isLoading: boolean,
  handlePrint?: (staffId: string) => void,
  handleDownload?: (staffId: string) => void,
  onDelete?: () => void,
  handleExcelExport?: (staff: Staff) => void,
  onArchive?: () => void
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "pno",
    header: "PNO/Unique ID",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("pno")}</div>;
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: isHindi ? "नाम" : "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableColumnFilter: true,
  },
  {
    accessorKey: "rank",
    header: isHindi ? "रैंक" : "Rank",
    cell: ({ row }) => <div>{row.getValue("rank")}</div>,
    filterFn: tokenExactMatchFilter,
    enableColumnFilter: true,
  },
  {
    accessorKey: "current_posting_district",
    header: isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District",
    cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: "mobile_number",
    header: isHindi ? "मोबाइल नंबर" : "Mobile Number",
    cell: ({ row }) => <div>{row.getValue("mobile_number")}</div>,
    enableColumnFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;
      
      return (
        <StaffRowActions
          staff={staff}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      );
    },
    enableColumnFilter: false,
  },
];

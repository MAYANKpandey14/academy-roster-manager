
import { useState } from "react";
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
import { MoreHorizontal, Edit, Trash, Eye, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
      header: "PNO",
      cell: ({ row }) => <div>{row.getValue("pno")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "rank",
      header: "Rank",
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
            {rank}
          </Badge>
        );
      },
    },
    {
      accessorKey: "current_posting_district",
      header: "Posting District",
      cell: ({ row }) => <div>{row.getValue("current_posting_district")}</div>,
    },
    {
      accessorKey: "mobile_number",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("mobile_number")}</div>,
    },
    {
      id: "actions",
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
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/edit-staff/${staff.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={staff}
        filterColumn="name"
        filterPlaceholder="Search by name..."
        isLoading={isLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => {
          toast.info("Print functionality will be implemented soon");
        }}>
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </Button>
        <Button variant="outline" onClick={() => {
          toast.info("Download functionality will be implemented soon");
        }}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
};

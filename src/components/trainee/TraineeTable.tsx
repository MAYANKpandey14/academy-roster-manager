
import { useState, useEffect } from "react";
import { 
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "./TraineeActions";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/exportUtils";
import { format } from "date-fns";

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TraineeTable({ trainees, onRefresh, isLoading = false }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  const columns: ColumnDef<Trainee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
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
      header: "PNO",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "father_name",
      header: "Father's Name",
    },
    {
      accessorKey: "current_posting_district",
      header: "District",
    },
    {
      accessorKey: "arrival_date",
      header: "Arrival Date",
      cell: ({ row }) => {
        const date = row.getValue("arrival_date") as string;
        return date ? format(new Date(date), "PP") : "N/A";
      },
    },
    {
      accessorKey: "departure_date",
      header: "Departure Date",
      cell: ({ row }) => {
        const date = row.getValue("departure_date") as string;
        return date ? format(new Date(date), "PP") : "N/A";
      },
    },
    {
      accessorKey: "mobile_number",
      header: "Mobile",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const trainee = row.original;
        return (
          <TraineeActions 
            trainee={trainee} 
            onEdit={() => {
              if (onRefresh) {
                onRefresh();
              }
            }}
          />
        );
      },
    },
  ];

  function getSelectedTrainees(): Trainee[] {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => trainees[index]);
  }

  function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to print");
      return;
    }
    
    const content = createPrintContent(selectedTrainees);
    handlePrint(content);
    toast.success(`Printing ${selectedTrainees.length} trainee(s)`);
  }

  function handleDownloadAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to download");
      return;
    }
    
    const content = createCSVContent(selectedTrainees);
    handleDownload(content, `selected_trainees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`CSV file with ${selectedTrainees.length} trainees downloaded successfully`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintAction}
          className="print-button"
          disabled={isLoading || selectedCount === 0}
        >
          <Printer className="h-4 w-4" />
          {!isMobile && <span className="ml-2">
            Print {selectedCount > 0 ? `Selected (${selectedCount})` : ""}
          </span>}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAction}
          className="download-button"
          disabled={isLoading || selectedCount === 0}
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span className="ml-2">
            Download {selectedCount > 0 ? `Selected (${selectedCount})` : ""}
          </span>}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={trainees}
        filterColumn="name"
        filterPlaceholder="Search by name..."
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
      />
    </div>
  );
}

import { useState } from "react";
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

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TraineeTable({ trainees, onRefresh, isLoading = false }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const isMobile = useIsMobile();
  
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

  function handlePrintSelected() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to print");
      return;
    }
    
    const content = createPrintContent(selectedTrainees);
    handlePrint(content);
  }

  function handleDownloadSelected() {
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
          onClick={handlePrintSelected}
          className="print-button"
          disabled={isLoading}
        >
          <Printer className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Print Selected</span>}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadSelected}
          className="download-button"
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Download Selected</span>}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={trainees}
        filterColumn="name"
        filterPlaceholder="Search by name..."
        isLoading={isLoading}
      />
    </div>
  );
}


import { useState } from "react";
import { format } from "date-fns";
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

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
}

export function TraineeTable({ trainees, onRefresh }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
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

  const getSelectedTrainees = (): Trainee[] => {
    // Get the indices of selected rows
    const selectedIndices = Object.keys(rowSelection).map(Number);
    // Return the trainee objects at those indices
    return selectedIndices.map(index => trainees[index]);
  };

  const handlePrintSelected = () => {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to print");
      return;
    }
    
    // Create printable version for all selected trainees
    let printContent = `
      <html>
        <head>
          <title>Selected Trainees Information</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            .trainee-info { border: 1px solid #ddd; padding: 15px; margin-bottom: 30px; page-break-after: always; }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; }
            .header p { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Police Training Academy</h1>
            <p>RTC Trainees Information</p>
          </div>
    `;
    
    selectedTrainees.forEach(trainee => {
      printContent += `
        <div class="trainee-info">
          <h2>${trainee.name} (${trainee.pno})</h2>
          <div class="field"><span class="field-label">Chest No:</span> ${trainee.chest_no}</div>
          <div class="field"><span class="field-label">Father's Name:</span> ${trainee.father_name}</div>
          <div class="field"><span class="field-label">Date of Birth:</span> ${new Date(trainee.date_of_birth).toLocaleDateString()}</div>
          <div class="field"><span class="field-label">Date of Joining:</span> ${new Date(trainee.date_of_joining).toLocaleDateString()}</div>
          <div class="field"><span class="field-label">Training Period:</span> ${new Date(trainee.arrival_date).toLocaleDateString()} to ${new Date(trainee.departure_date).toLocaleDateString()}</div>
          <div class="field"><span class="field-label">Current Posting:</span> ${trainee.current_posting_district}</div>
          <div class="field"><span class="field-label">Mobile:</span> ${trainee.mobile_number}</div>
          <div class="field"><span class="field-label">Education:</span> ${trainee.education}</div>
          <div class="field"><span class="field-label">Blood Group:</span> ${trainee.blood_group}</div>
          <div class="field"><span class="field-label">Nominee:</span> ${trainee.nominee}</div>
          <div class="field"><span class="field-label">Home Address:</span> ${trainee.home_address}</div>
        </div>
      `;
    });
    
    printContent += `
        <div style="text-align: center; font-size: 12px;">
          <p>This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;
    
    // Create a new window to print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      // Wait for content to load before printing
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      toast.error("Failed to open print window. Please check your pop-up blocker settings.");
    }
  };

  const handleDownloadSelectedCSV = () => {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("Please select at least one trainee to download");
      return;
    }
    
    // Headers for the CSV file
    const headers = [
      "PNO", "Chest No", "Name", "Father's Name", "Arrival Date",
      "Departure Date", "Current Posting District", "Mobile Number",
      "Education", "Date of Birth", "Date of Joining", "Blood Group",
      "Nominee", "Home Address"
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    selectedTrainees.forEach(trainee => {
      const row = [
        trainee.pno,
        trainee.chest_no,
        trainee.name,
        trainee.father_name,
        new Date(trainee.arrival_date).toLocaleDateString(),
        new Date(trainee.departure_date).toLocaleDateString(),
        trainee.current_posting_district,
        trainee.mobile_number,
        trainee.education,
        new Date(trainee.date_of_birth).toLocaleDateString(),
        new Date(trainee.date_of_joining).toLocaleDateString(),
        trainee.blood_group,
        trainee.nominee,
        trainee.home_address.replace(/,/g, ' ')  // Remove commas in address to not break CSV format
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trainees_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`CSV file with ${selectedTrainees.length} trainees downloaded successfully`);
  };

  return (
    <div className="space-y-4">
      {/* Bulk actions */}
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintSelected}
          className="print-button"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadSelectedCSV}
          className="download-button"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Selected
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={trainees}
        filterColumn="name"
        filterPlaceholder="Search by name..."
      />
    </div>
  );
}

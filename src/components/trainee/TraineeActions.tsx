
import { useState } from "react";
import { 
  Download,
  Printer, 
  Edit,
} from "lucide-react";
import { Trainee } from "@/types/trainee";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TraineeForm } from "./TraineeForm";
import { toast } from "sonner";

interface TraineeActionsProps {
  trainee: Trainee;
  onEdit?: (trainee: Trainee) => void;
}

export function TraineeActions({ trainee, onEdit }: TraineeActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handlePrint = () => {
    // Create printable version
    const printContent = `
      <html>
        <head>
          <title>Trainee Information - ${trainee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 30px; }
            .trainee-info { border: 1px solid #ddd; padding: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; }
            .header p { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Police Training Academy</h1>
            <p>RTC Trainee Information</p>
          </div>
          
          <div class="trainee-info">
            <div class="field"><span class="field-label">Name:</span> ${trainee.name}</div>
            <div class="field"><span class="field-label">PNO:</span> ${trainee.pno}</div>
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
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
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
      }, 250);
    } else {
      toast.error("Failed to open print window. Please check your pop-up blocker settings.");
    }
  };

  const handleDownloadCSV = () => {
    // Convert trainee data to CSV format
    const headers = [
      "PNO", "Chest No", "Name", "Father's Name", "Arrival Date",
      "Departure Date", "Current Posting District", "Mobile Number",
      "Education", "Date of Birth", "Date of Joining", "Blood Group",
      "Nominee", "Home Address"
    ];
    
    const values = [
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
      trainee.home_address
    ];
    
    let csvContent = headers.join(',') + '\n' + values.join(',');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file downloaded successfully");
  };

  return (
    <div className="flex space-x-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Edit Trainee</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6 pt-2">
            <TraineeForm 
              trainee={trainee} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                if (onEdit) {
                  onEdit(trainee);
                }
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              isEditMode={true}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="print-button"
        onClick={handlePrint}
        title="Print"
      >
        <Printer className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="download-button"
        onClick={handleDownloadCSV}
        title="Download CSV"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}

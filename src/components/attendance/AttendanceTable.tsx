
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useFetchAttendance } from "./hooks/useFetchAttendance";
import { AttendanceTableRow } from "./AttendanceTableRow";

interface AttendanceTableProps {
  personId: string;
  personType: "staff" | "trainee";
  pno?: string;
}

export const AttendanceTable = ({ personId, personType, pno }: AttendanceTableProps) => {
  const [month, setMonth] = useState(new Date());
  const { isHindi } = useLanguage();
  const { data: attendanceRecords, isLoading } = useFetchAttendance(personId, personType);

  const handlePrint = () => {
    const printContent = document.getElementById('attendance-table')?.outerHTML;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>${pno ? `${isHindi ? 'पी.एन.ओ: ' : 'PNO: '} ${pno}` : ''}</h2>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h3 className={`font-medium ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "उपस्थिति सारांश" : "Attendance Summary"}
        </h3>
        
        <div className="flex items-center gap-4">
          <input 
            type="month" 
            value={format(month, 'yyyy-MM')}
            onChange={(e) => setMonth(new Date(e.target.value))} 
            className="p-2 border rounded"
          />
          
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            <span className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? "प्रिंट करें" : "Print"}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table id="attendance-table">
          <TableHeader>
            <TableRow>
              <TableHead className={isHindi ? 'font-mangal' : ''}>
                {isHindi ? "दिनांक" : "Date"}
              </TableHead>
              <TableHead className={isHindi ? 'font-mangal' : ''}>
                {isHindi ? "स्थिति" : "Status"}
              </TableHead>
              <TableHead className={isHindi ? 'font-mangal' : ''}>
                {isHindi ? "कारण" : "Reason"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <span className={isHindi ? 'font-mangal' : ''}>
                    {isHindi ? "लोड हो रहा है..." : "Loading..."}
                  </span>
                </TableCell>
              </TableRow>
            ) : attendanceRecords && attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <AttendanceTableRow key={record.id} record={record} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <span className={isHindi ? 'font-mangal' : ''}>
                    {isHindi ? "कोई डेटा उपलब्ध नहीं है" : "No data available"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

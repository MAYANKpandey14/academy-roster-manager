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
import { PersonData } from "./PersonSearch";
import { handlePrint } from "@/utils/export/printUtils";

interface AttendanceTableProps {
  personId: string;
  personType: "staff" | "trainee";
  personData?: PersonData;
}

export const AttendanceTable = ({ personId, personType, personData }: AttendanceTableProps) => {
  const [month, setMonth] = useState(new Date());
  const { isHindi } = useLanguage();
  const { data: attendanceRecords, isLoading } = useFetchAttendance(personId, personType);

  const handlePrintClick = () => {
    const printContent = document.getElementById('attendance-table')?.outerHTML;
    if (!printContent) return;
    
    const content = `
      <html>
        <head>
          <title>${isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}</title>
          <style>
            body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 20px; }
            .font-mangal { font-family: 'Mangal', 'Arial Unicode MS', sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header-info { margin-bottom: 20px; }
            .header-info h3 { margin: 5px 0; }
            .print-button {
              background-color: rgb(41, 100, 188);
              color: white;
              padding: 10px 20px;
              border: none;
            }
          </style>
        </head>
        <body>
          <div class="header-info">
            <h3 class="${isHindi ? 'font-mangal' : ''}">${isHindi ? 'पी.एन.ओ: ' : 'PNO: '} ${personData?.pno || '-'}</h3>
            <h3 class="${isHindi ? 'font-mangal' : ''}">${isHindi ? 'नाम: ' : 'Name: '} ${personData?.name || '-'}</h3>
            ${personType === 'staff' ? `
              <h3 class="${isHindi ? 'font-mangal' : ''}">${isHindi ? 'रैंक: ' : 'Rank: '} ${personData?.rank || '-'}</h3>
            ` : `
              <h3 class="${isHindi ? 'font-mangal' : ''}">${isHindi ? 'छाती संख्या: ' : 'Chest No: '} ${personData?.chest_no || '-'}</h3>
            `}
          </div>
          ${printContent}
        </body>
      </html>
    `;
    
    handlePrint(content);
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
          
          <Button variant="outline" size="sm" onClick={handlePrintClick}>
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

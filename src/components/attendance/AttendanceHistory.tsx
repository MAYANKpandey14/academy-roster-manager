
import { useEffect, useState } from "react";
import { AttendanceTable } from "./AttendanceTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonData } from "./PersonSearch";
import { Button } from "@/components/ui/button";
import { Printer, FileSpreadsheet } from "lucide-react";
import { handlePrint } from "@/utils/export/printUtils";
import { exportToExcel } from "@/utils/export/excelUtils";
import { useFetchAttendance } from "./hooks/useFetchAttendance";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { AttendanceTableRow } from "./AttendanceTableRow";
import { toast } from "sonner";

interface AttendanceHistoryProps {
  personId: string;
  personType: "staff" | "trainee";
  personData?: PersonData;
}

export const AttendanceHistory = ({ personId, personType, personData }: AttendanceHistoryProps) => {
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

  const handleExcelExport = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      toast.error(isHindi ? "निर्यात के लिए कोई डेटा नहीं है" : "No data to export");
      return;
    }

    const exportData = attendanceRecords.map((record, index) => ({
      id: index + 1,
      date: new Date(record.date).toLocaleDateString(),
      status: record.status,
      reason: record.reason || '-'
    }));

    const columns = [
      { key: 'id', header: isHindi ? 'क्र.सं.' : 'S.No.' },
      { key: 'date', header: isHindi ? 'दिनांक' : 'Date' },
      { key: 'status', header: isHindi ? 'स्थिति' : 'Status' },
      { key: 'reason', header: isHindi ? 'कारण' : 'Reason' }
    ];

    const personName = personData?.name || 'person';
    const filename = `attendance_${personType}_${personName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    const success = exportToExcel(exportData, columns, filename);
    if (success) {
      toast.success(isHindi ? 'एक्सेल फ़ाइल डाउनलोड हो गई है' : 'Excel file downloaded successfully');
    } else {
      toast.error(isHindi ? 'एक्सेल निर्यात विफल हुआ' : 'Excel export failed');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h3 className={`font-medium ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "उपस्थिति सारांश" : "Attendance Summary"}
        </h3>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExcelExport} disabled={isLoading || !attendanceRecords || attendanceRecords.length === 0}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            <span className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? "एक्सेल" : "Excel"}
            </span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintClick} disabled={isLoading || !attendanceRecords || attendanceRecords.length === 0}>
            <Printer className="h-4 w-4 mr-2" />
            <span className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? "प्रिंट करें" : "Print"}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <ScrollArea className="h-[350px]">
          <Table id="attendance-table">
            <TableHeader className="sticky top-0 bg-white z-10">
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
        </ScrollArea>
      </div>
    </div>
  );
};

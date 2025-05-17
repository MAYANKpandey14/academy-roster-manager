
import { useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonData, PersonType } from "./types/attendanceTypes";
import { createPersonWithAttendancePrintContent } from "@/utils/export/attendancePrintUtils";

interface AttendanceHistoryProps {
  personId: string;
  personType: PersonType;
  personData?: PersonData;
}

export const AttendanceHistory = ({ personId, personType, personData }: AttendanceHistoryProps) => {
  const { isHindi } = useLanguage();
  const { records: attendanceRecords, isLoading } = useFetchAttendance(personId, personType);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrintClick = () => {
    if (!personData) {
      toast.error(isHindi ? "प्रिंट करने के लिए व्यक्ति विवरण अनुपलब्ध" : "Person details unavailable for printing");
      return;
    }
    
    // Use the new combined print format
    const content = createPersonWithAttendancePrintContent(
      personData,
      personType,
      attendanceRecords,
      isHindi
    );
    
    const success = handlePrint(content);
    if (!success) {
      toast.error(isHindi ? "प्रिंट विंडो खोलने में त्रुटि" : "Error opening print window");
    }
  };

  const handleExcelExport = async () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      toast.error(isHindi ? "निर्यात के लिए कोई डेटा नहीं है" : "No data to export");
      return;
    }

    setIsExporting(true);
    
    try {
      const exportData = attendanceRecords.map((record, index) => ({
        id: index + 1,
        date: record.date,
        type: record.type,
        leave_type: record.leave_type || '-',
        reason: record.reason || '-',
        status: record.approvalStatus
      }));

      const columns = [
        { key: 'id', header: isHindi ? 'क्र.सं.' : 'S.No.' },
        { key: 'date', header: isHindi ? 'दिनांक' : 'Date' },
        { key: 'type', header: isHindi ? 'प्रकार' : 'Type' },
        { key: 'leave_type', header: isHindi ? 'छुट्टी प्रकार' : 'Leave Type' },
        { key: 'reason', header: isHindi ? 'कारण' : 'Reason' },
        { key: 'status', header: isHindi ? 'स्थिति' : 'Status' }
      ];

      const personName = personData?.name || 'person';
      const filename = `attendance_${personType}_${personName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      const success = await exportToExcel(exportData, columns, filename);
      if (success) {
        toast.success(isHindi ? 'एक्सेल फ़ाइल डाउनलोड हो गई है' : 'Excel file downloaded successfully');
      } else {
        toast.error(isHindi ? 'एक्सेल निर्यात विफल हुआ' : 'Excel export failed');
      }
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error(isHindi ? 'एक्सेल निर्यात विफल हुआ' : 'Excel export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <h3 className={`font-medium ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "उपस्थिति सारांश" : "Attendance Summary"}
        </h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExcelExport} 
            disabled={isLoading || !attendanceRecords || attendanceRecords.length === 0 || isExporting}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            <span className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? (isExporting ? "निर्यात हो रहा है..." : "एक्सेल") : (isExporting ? "Exporting..." : "Excel")}
            </span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrintClick} 
            disabled={isLoading || !personData}
          >
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
                  {isHindi ? "प्रकार" : "Type"}
                </TableHead>
                <TableHead className={isHindi ? 'font-mangal' : ''}>
                  {isHindi ? "कारण" : "Reason"}
                </TableHead>
                <TableHead className={isHindi ? 'font-mangal' : ''}>
                  {isHindi ? "अनुमोदन स्थिति" : "Approval Status"}
                </TableHead>
                <TableHead className={isHindi ? 'font-mangal' : ''}>
                  {isHindi ? "कार्य" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <span className={isHindi ? 'font-mangal' : ''}>
                      {isHindi ? "लोड हो रहा है..." : "Loading..."}
                    </span>
                  </TableCell>
                </TableRow>
              ) : attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <AttendanceTableRow 
                    key={record.id} 
                    record={record} 
                    personType={personType} 
                  />  
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
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


import { useState, useEffect } from "react";
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
import { PersonData, PersonType } from "@/types/attendance";
import { AttendanceFilters as FiltersType, AttendanceFilters } from "./AttendanceFilters";
import { format } from "date-fns";

interface AttendanceHistoryProps {
  personId: string;
  personType: PersonType;
  personData?: PersonData;
}

export const AttendanceHistory = ({ personId, personType, personData }: AttendanceHistoryProps) => {
  const { isHindi } = useLanguage();
  const [filters, setFilters] = useState<FiltersType>({});
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Convert dates to string format for the API
  const startDateStr = filters.startDate 
    ? format(filters.startDate, 'yyyy-MM-dd')
    : undefined;
    
  const endDateStr = filters.endDate
    ? format(filters.endDate, 'yyyy-MM-dd') 
    : undefined;

  // Fetch attendance with filters
  const { 
    data: attendanceRecords, 
    isLoading,
    error
  } = useFetchAttendance(personId, personType, startDateStr, endDateStr);

  // Apply client-side filters for status and approval status
  useEffect(() => {
    if (!attendanceRecords) {
      setFilteredRecords([]);
      return;
    }
    
    let filtered = [...attendanceRecords];
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(record => 
        record.type === filters.status
      );
    }
    
    // Filter by approval status
    if (filters.approvalStatus) {
      filtered = filtered.filter(record => 
        record.approval_status === filters.approvalStatus
      );
    }
    
    setFilteredRecords(filtered);
  }, [attendanceRecords, filters.status, filters.approvalStatus]);

  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
  };

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
            ${filters.startDate ? `
              <h3 class="${isHindi ? 'font-mangal' : ''}">${isHindi ? 'फ़िल्टर: ' : 'Filter: '} 
                ${format(filters.startDate, 'dd/MM/yyyy')}
                ${filters.endDate ? ' - ' + format(filters.endDate, 'dd/MM/yyyy') : ''}
              </h3>
            ` : ''}
          </div>
          ${printContent}
        </body>
      </html>
    `;
    
    handlePrint(content);
  };

  const handleExcelExport = async () => {
    if (!filteredRecords || filteredRecords.length === 0) {
      toast.error(isHindi ? "निर्यात के लिए कोई डेटा नहीं है" : "No data to export");
      return;
    }

    setIsExporting(true);
    
    try {
      const exportData = filteredRecords.map((record, index) => ({
        id: index + 1,
        date: record.date,
        type: record.type,
        reason: record.reason || '-',
        status: record.approval_status
      }));

      const columns = [
        { key: 'id', header: isHindi ? 'क्र.सं.' : 'S.No.' },
        { key: 'date', header: isHindi ? 'दिनांक' : 'Date' },
        { key: 'type', header: isHindi ? 'प्रकार' : 'Type' },
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
          {/* Add filters component */}
          <AttendanceFilters onFilterChange={handleFilterChange} />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExcelExport} 
            disabled={isLoading || !filteredRecords || filteredRecords.length === 0 || isExporting}
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
            disabled={isLoading || !filteredRecords || filteredRecords.length === 0}
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
                  {isHindi ? "स्थिति" : "Status"}
                </TableHead>
                <TableHead className={isHindi ? 'font-mangal' : ''}>
                  {isHindi ? "कार्रवाई" : "Actions"}
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
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-red-500">
                    <span className={isHindi ? 'font-mangal' : ''}>
                      {isHindi ? "डेटा लोड करने में त्रुटि" : "Error loading data"}
                    </span>
                  </TableCell>
                </TableRow>
              ) : filteredRecords && filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <AttendanceTableRow 
                    key={record.id || `record-${record.date}`} 
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


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceTableRow } from "./AttendanceTableRow";
import { type AttendanceRecord } from "./hooks/useFetchAttendance";
import { PersonType } from "./types/attendanceTypes";

interface AttendanceTableProps {
  attendanceRecords: AttendanceRecord[];
  personType: PersonType;
}

export const AttendanceTable = ({ attendanceRecords, personType }: AttendanceTableProps) => {
  const { isHindi } = useLanguage();

  console.log("AttendanceTable received records:", attendanceRecords);

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'कोई उपस्थिति रिकॉर्ड उपलब्ध नहीं है' : 'No attendance records available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'दिनांक' : 'Date'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'स्थिति' : 'Status'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'कारण' : 'Reason'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'अनुमोदन स्थिति' : 'Approval Status'}
              </TableHead>
              <TableHead className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'कार्रवाई' : 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((record) => (
              <AttendanceTableRow
                key={record.id}
                record={record}
                personType={personType}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

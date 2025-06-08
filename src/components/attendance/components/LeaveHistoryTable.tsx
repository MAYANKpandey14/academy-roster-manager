
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonType } from "../types/attendanceTypes";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";
import { Card, CardContent } from "@/components/ui/card";
import { type LeaveRecord } from "../hooks/useFetchAttendance";

interface LeaveHistoryTableProps {
  leaveRecords: LeaveRecord[];
  personType: PersonType;
}

export const LeaveHistoryTable = ({ leaveRecords, personType }: LeaveHistoryTableProps) => {
  const { isHindi } = useLanguage();

  console.log("LeaveHistoryTable received records:", leaveRecords);

  if (!leaveRecords || leaveRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'कोई छुट्टी का रिकॉर्ड उपलब्ध नहीं है' : 'No leave records available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <LeaveHistoryTableContent leaveRecords={leaveRecords} personType={personType} />;
};


import { useLanguage } from "@/contexts/LanguageContext";
import { PersonType } from "../types/attendanceTypes";
import { useFetchAttendance } from "../hooks/useFetchAttendance";
import { LeaveHistoryTableContent } from "./LeaveHistoryTableContent";
import { Card, CardContent } from "@/components/ui/card";

interface LeaveHistoryTableProps {
  personId: string;
  personType: PersonType;
}

export const LeaveHistoryTable = ({ personId, personType }: LeaveHistoryTableProps) => {
  const { isHindi } = useLanguage();
  const { data, isLoading, error } = useFetchAttendance(personId, personType);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center bg-red-50">
          <p className="text-red-600">
            {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return <LeaveHistoryTableContent leaveRecords={data?.leave || []} personType={personType} />;
};

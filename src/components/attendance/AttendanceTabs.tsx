
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceTable } from "./AttendanceTable";
import { LeaveHistoryTable } from "./components/LeaveHistoryTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonData, PersonType } from "./types/attendanceTypes";
import { useFetchPersonAttendance } from "./hooks/useFetchAttendance";

interface AttendanceTabsProps {
  personId: string;
  personType: PersonType;
  pno?: string; 
  personData?: PersonData;
}

export const AttendanceTabs = ({ personId, personType, personData }: AttendanceTabsProps) => {
  const [activeTab, setActiveTab] = useState("attendance");
  const { isHindi } = useLanguage();
  const { data } = useFetchPersonAttendance(personId, personType);

  useEffect(() => {
    // Reset to attendance tab when person changes
    setActiveTab("attendance");
  }, [personId]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6 animate-fade-in">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="attendance" className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "उपस्थिति" : "Attendance"}
        </TabsTrigger>
        <TabsTrigger value="history" className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "छुट्टी का इतिहास" : "Leave History"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="attendance" className="mt-4">
        <AttendanceTable 
          key={`attendance-${personId}`}
          attendanceRecords={data?.attendanceRecords || []} 
          personType={personType}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <LeaveHistoryTable 
          key={`history-${personId}`}
          personId={personId} 
          personType={personType} 
        />
      </TabsContent>
    </Tabs>
  );
};

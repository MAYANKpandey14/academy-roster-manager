
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceTable } from "./AttendanceTable";
import { LeaveHistoryTable } from "./components/LeaveHistoryTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonData, PersonType } from "./types/attendanceTypes";
import { useFetchAttendance } from "./hooks/useFetchAttendance";

interface AttendanceTabsProps {
  personId: string;
  personType: PersonType;
  pno?: string; 
  personData?: PersonData;
}

export const AttendanceTabs = ({ personId, personType, personData }: AttendanceTabsProps) => {
  const [activeTab, setActiveTab] = useState("attendance");
  const { isHindi } = useLanguage();
  const { data, isLoading, error } = useFetchAttendance(personId, personType);

  useEffect(() => {
    // Reset to attendance tab when person changes
    setActiveTab("attendance");
  }, [personId]);

  console.log("AttendanceTabs data:", data);
  console.log("AttendanceTabs loading:", isLoading);
  console.log("AttendanceTabs error:", error);

  if (isLoading) {
    return (
      <div className="w-full mt-6 animate-fade-in">
        <div className="text-center p-6">
          <p className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error in AttendanceTabs:", error);
    return (
      <div className="w-full mt-6 animate-fade-in">
        <div className="text-center p-6 bg-red-50">
          <p className="text-red-600">
            {isHindi ? 'डेटा लोड करने में त्रुटि' : 'Error loading data'}
          </p>
        </div>
      </div>
    );
  }

  const { attendance = [], leave = [] } = data || {};

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6 animate-fade-in">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="attendance" className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "उपस्थिति" : "Attendance"} ({attendance.length})
        </TabsTrigger>
        <TabsTrigger value="history" className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "छुट्टी का इतिहास" : "Leave History"} ({leave.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="attendance" className="mt-4">
        <AttendanceTable 
          key={`attendance-${personId}`}
          attendanceRecords={attendance} 
          personType={personType}
        />
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <LeaveHistoryTable 
          key={`history-${personId}`}
          leaveRecords={leave}
          personType={personType} 
        />
      </TabsContent>
    </Tabs>
  );
};

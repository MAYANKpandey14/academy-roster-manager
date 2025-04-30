
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceTable } from "./AttendanceTable";
import { LeaveHistoryTable } from "./components/LeaveHistoryTable";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttendanceTabsProps {
  personId: string;
  personType: "staff" | "trainee";
  searchData?: any;
}

export const AttendanceTabs = ({ personId, personType, searchData }: AttendanceTabsProps) => {
  const [activeTab, setActiveTab] = useState("attendance");
  const { isHindi } = useLanguage();

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
          personId={personId} 
          personType={personType} 
          searchData={searchData} 
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

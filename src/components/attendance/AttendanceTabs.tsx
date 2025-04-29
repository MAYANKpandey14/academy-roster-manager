
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AttendanceTable } from "./AttendanceTable";
import { LeaveHistoryTable } from "./components/LeaveHistoryTable";

interface AttendanceTabsProps {
  personId?: string;
  personType: 'trainee' | 'staff';
  searchData?: any;
}

export function AttendanceTabs({ personId, personType, searchData }: AttendanceTabsProps) {
  const [key, setKey] = useState(0);

  const handleSuccess = () => {
    setKey(prev => prev + 1);
  };

  return (
    <Tabs defaultValue="attendance" className="w-full">
      <TabsList>
        <TabsTrigger value="attendance">उपस्थिति रिकॉर्ड</TabsTrigger>
        <TabsTrigger value="leave">अवकाश इतिहास</TabsTrigger>
      </TabsList>
      <TabsContent value="attendance">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">उपस्थिति रिकॉर्ड</h2>
          <AttendanceTable
            key={`attendance-${key}`}
          />
        </Card>
      </TabsContent>
      <TabsContent value="leave">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">अनुपस्थिति और अवकाश इतिहास</h2>
          <LeaveHistoryTable
            key={`leave-${key}`}
            personId={personId}
            personType={personType}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}

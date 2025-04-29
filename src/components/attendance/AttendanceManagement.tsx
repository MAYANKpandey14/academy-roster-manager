
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceForm from "./AttendanceForm";
import AttendanceTable from "./AttendanceTable";

export function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="add" className="w-full font-mangal">अनुपस्थिति / अवकाश दर्ज करें</TabsTrigger>
          <TabsTrigger value="view" className="w-full font-mangal">अनुपस्थिति रिकॉर्ड देखें</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="mt-4">
          <AttendanceForm />
        </TabsContent>
        
        <TabsContent value="view" className="mt-4">
          <AttendanceTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

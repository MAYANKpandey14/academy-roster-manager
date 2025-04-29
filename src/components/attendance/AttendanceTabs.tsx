
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { AttendanceLeaveForm } from "./AttendanceLeaveForm";
import { LeaveHistoryTable } from "./LeaveHistoryTable";
import { PersonType } from "./types";

interface AttendanceTabsProps {
  activeTab: PersonType;
  setActiveTab: (tab: PersonType) => void;
  personData: any | null;
}

export function AttendanceTabs({ activeTab, setActiveTab, personData }: AttendanceTabsProps) {
  return (
    <Tabs 
      defaultValue="trainee" 
      value={activeTab} 
      onValueChange={(value) => setActiveTab(value as PersonType)}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="trainee" className="dynamic-text">प्रशिक्षु उपस्थिति</TabsTrigger>
        <TabsTrigger value="staff" className="dynamic-text">स्टाफ उपस्थिति</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trainee" className="space-y-6">
        <AttendanceLeaveForm 
          type="trainee" 
          personId={personData?.id} 
          onSuccess={() => {
            toast.success("डेटा सफलतापूर्वक सहेजा गया");
          }}
        />
        
        {personData?.id && (
          <LeaveHistoryTable 
            type="trainee"
            personId={personData.id}
          />
        )}
      </TabsContent>
      
      <TabsContent value="staff" className="space-y-6">
        <AttendanceLeaveForm 
          type="staff" 
          personId={personData?.id}
          onSuccess={() => {
            toast.success("डेटा सफलतापूर्वक सहेजा गया");
          }}
        />
        
        {personData?.id && (
          <LeaveHistoryTable 
            type="staff"
            personId={personData.id}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}

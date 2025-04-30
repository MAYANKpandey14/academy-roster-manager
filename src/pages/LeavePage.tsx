
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveForm } from "@/components/leave/LeaveForm";
import { useState } from "react";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";

const LeavePage = () => {
  const [key, setKey] = useState(0);
  const { isHindi } = useLanguage();
  
  // Use the language inputs hook
  useLanguageInputs();

  const handleSuccess = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold mb-6 dynamic-text">{isHindi ? "छुट्टी प्रबंधन" : "Leave Management"}</h1>
        
        <Tabs defaultValue="trainee">
          <TabsList className="mb-4">
            <TabsTrigger value="trainee" className="dynamic-text">{isHindi ? "प्रशिक्षु छुट्टी" : "Trainee Leave"}</TabsTrigger>
            <TabsTrigger value="staff" className="dynamic-text">{isHindi ? "स्टाफ छुट्टी" : "Staff Leave"}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainee" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dynamic-text">{isHindi ? "प्रशिक्षु छुट्टी अनुरोध दें" : "Submit Trainee Leave Request"}</h2>
            <LeaveForm 
              key={`trainee-${key}`}
              type="trainee"
              onSuccess={handleSuccess}
            />
          </TabsContent>
          
          <TabsContent value="staff" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dynamic-text">{isHindi ? "स्टाफ छुट्टी अनुरोध दें" : "Submit Staff Leave Request"}</h2>
            <LeaveForm 
              key={`staff-${key}`}
              type="staff"
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LeavePage;

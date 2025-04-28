
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveForm } from "@/components/leave/LeaveForm";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

const LeavePage = () => {
  const [key, setKey] = useState(0);
  const { t } = useTranslation();
  
  // Use the language inputs hook
  useLanguageInputs();

  const handleSuccess = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold mb-6 dynamic-text">{t('leaveManagement')}</h1>
        
        <Tabs defaultValue="trainee">
          <TabsList className="mb-4">
            <TabsTrigger value="trainee" className="dynamic-text">{t('traineeLeave')}</TabsTrigger>
            <TabsTrigger value="staff" className="dynamic-text">{t('staffLeave')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainee" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dynamic-text">{t('submitTraineeLeaveRequest')}</h2>
            <LeaveForm 
              key={`trainee-${key}`}
              type="trainee"
              onSuccess={handleSuccess}
            />
          </TabsContent>
          
          <TabsContent value="staff" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 dynamic-text">{t('submitStaffLeaveRequest')}</h2>
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

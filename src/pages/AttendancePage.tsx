
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonSearch, PersonData } from "@/components/attendance/PersonSearch";
import { PersonDetails } from "@/components/attendance/PersonDetails";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";

export default function AttendancePage() {
  const { isHindi } = useLanguage();
  const [person, setPerson] = useState<PersonData | null>(null);
  const [personType, setPersonType] = useState<'trainee' | 'staff'>('trainee');
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  
  // Apply language-specific classes to inputs
  useLanguageInputs();

  const handlePersonFound = (foundPerson: PersonData, type: 'trainee' | 'staff') => {
    setPerson(foundPerson);
    setPersonType(type);
  };

  const handleSuccess = () => {
    // Optionally switch to view tab after adding attendance
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className={`text-2xl font-semibold mb-6 ${isHindi ? "font-mangal" : "dynamic-text"}`}>
          {isHindi ? "उपस्थिति प्रबंधन" : "Attendance Management"}
        </h1>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <PersonSearch onPersonFound={handlePersonFound} />
          
          {person && (
            <div className="mt-6 space-y-6 animate-fade-in">
              <PersonDetails person={person} personType={personType} />
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'view' | 'add')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="view" className={`${isHindi ? "font-mangal" : ""}`}>
                    {isHindi ? "उपस्थिति देखें" : "View Attendance"}
                  </TabsTrigger>
                  <TabsTrigger value="add" className={`${isHindi ? "font-mangal" : ""}`}>
                    {isHindi ? "अनुपस्थिति/छुट्टी दर्ज करें" : "Mark Absence/Leave"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="view" className="pt-4">
                  <AttendanceTable 
                    personId={person.id} 
                    personType={personType} 
                    pno={person.pno}
                  />
                </TabsContent>
                
                <TabsContent value="add" className="pt-4">
                  <h3 className={`text-lg font-medium mb-4 ${isHindi ? "font-mangal" : ""}`}>
                    {isHindi ? "अनुपस्थिति या छुट्टी दर्ज करें" : "Mark Absence or Leave"}
                  </h3>
                  <AttendanceForm
                    personId={person.id}
                    personType={personType}
                    pno={person.pno}
                    onSuccess={handleSuccess}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

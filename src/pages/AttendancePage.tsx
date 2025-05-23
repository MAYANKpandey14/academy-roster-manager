
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonSearch } from "@/components/attendance/PersonSearch";
import { PersonDetails } from "@/components/attendance/PersonDetails";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { PersonData, PersonType } from "@/components/attendance/types/attendanceTypes";

export default function AttendancePage() {
  const { isHindi } = useLanguage();
  const [person, setPerson] = useState<PersonData | null>(null);
  const [personType, setPersonType] = useState<PersonType>('trainee');
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  
  // Apply language-specific classes to inputs
  useLanguageInputs();

  const handlePersonSelected = (foundPerson: PersonData | null, type: PersonType) => {
    console.log("Person selected:", foundPerson, "Type:", type);
    setPerson(foundPerson);
    setPersonType(type);
  };

  const handleSuccess = () => {
    // Switch to view tab after adding attendance
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <h1 className={`text-2xl font-semibold mb-6 ${isHindi ? "font-mangal" : ""}`}>
          {isHindi ? "उपस्थिति प्रबंधन" : "Attendance Management"}
        </h1>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 animate-scale-in">
          <PersonSearch onPersonSelected={handlePersonSelected} />
          
          {person && (
            <div className="mt-6 space-y-6 animate-fade-in">
              <PersonDetails person={person} personType={personType} />
              
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'view' | 'add')}>
                <TabsList className="mb-4">
                  <TabsTrigger 
                    value="view" 
                    className={`${isHindi ? "font-mangal" : ""} transition-all duration-200 hover:bg-gray-100`}
                  >
                    {isHindi ? "उपस्थिति देखें" : "View Attendance"}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="add" 
                    className={`${isHindi ? "font-mangal" : ""} transition-all duration-200 hover:bg-gray-100`}
                  >
                    {isHindi ? "अनुपस्थिति/छुट्टी दर्ज करें" : "Mark Absence/Leave"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="view" className="pt-4 animate-fade-in">
                  <AttendanceHistory 
                    personId={person.id} 
                    personType={personType} 
                  />
                </TabsContent>
                
                <TabsContent value="add" className="pt-4 animate-fade-in">
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

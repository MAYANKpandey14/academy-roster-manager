
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { useState } from "react";

export default function AttendancePage() {
  const [key, setKey] = useState(0); // Used to force re-render of forms

  const handleSuccess = () => {
    setKey(prev => prev + 1); // Force re-render the form
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold mb-6">Attendance Management</h1>
        
        <Tabs defaultValue="trainee">
          <TabsList className="mb-4">
            <TabsTrigger value="trainee">Trainee Attendance</TabsTrigger>
            <TabsTrigger value="staff">Staff Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainee" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Mark Trainee Attendance</h2>
            <AttendanceForm 
              key={`trainee-${key}`}
              type="trainee"
              onSuccess={handleSuccess}
            />
          </TabsContent>
          
          <TabsContent value="staff" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Mark Staff Attendance</h2>
            <AttendanceForm 
              key={`staff-${key}`}
              type="staff"
              onSuccess={handleSuccess}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

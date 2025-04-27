
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AttendancePage = () => {
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
            <p className="text-center text-gray-500">Trainee attendance management coming soon...</p>
          </TabsContent>
          
          <TabsContent value="staff" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center text-gray-500">Staff attendance management coming soon...</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AttendancePage;

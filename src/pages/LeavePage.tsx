
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LeavePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold mb-6">Leave Management</h1>
        
        <Tabs defaultValue="trainee">
          <TabsList className="mb-4">
            <TabsTrigger value="trainee">Trainee Leave</TabsTrigger>
            <TabsTrigger value="staff">Staff Leave</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trainee" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center text-gray-500">Trainee leave management coming soon...</p>
          </TabsContent>
          
          <TabsContent value="staff" className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center text-gray-500">Staff leave management coming soon...</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LeavePage;

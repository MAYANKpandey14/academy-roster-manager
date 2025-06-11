
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TraineeAttendancePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  const { data: trainee, isLoading, error } = useQuery({
    queryKey: ["trainee", id],
    queryFn: async () => {
      if (!id) throw new Error("Trainee ID is required");
      
      const { data, error } = await supabase
        .from("trainees")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <p className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !trainee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="text-center">
            <p className="text-red-600">
              {isHindi ? 'प्रशिक्षु नहीं मिला' : 'Trainee not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const handleAttendanceSuccess = () => {
    setShowAttendanceForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/trainees")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {isHindi ? "वापस" : "Back"}
            </Button>
            <h1 className={`text-2xl font-semibold ${isHindi ? "font-hindi" : ""}`}>
              {isHindi ? "प्रशिक्षु उपस्थिति" : "Trainee Attendance"}
            </h1>
          </div>
          
          <Button 
            onClick={() => setShowAttendanceForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {isHindi ? "उपस्थिति/छुट्टी दर्ज करें" : "Mark Attendance/Leave"}
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "प्रशिक्षु विवरण" : "Trainee Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "नाम:" : "Name:"}
                </p>
                <p>{trainee.name}</p>
              </div>
              <div>
                <p className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "पी.नं.:" : "P.No:"}
                </p>
                <p>{trainee.pno}</p>
              </div>
              <div>
                <p className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "छाती नं.:" : "Chest No:"}
                </p>
                <p>{trainee.chest_no}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <AttendanceHistory personId={trainee.id} personType="trainee" />

        <Dialog open={showAttendanceForm} onOpenChange={setShowAttendanceForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "उपस्थिति/छुट्टी दर्ज करें" : "Mark Attendance/Leave"}
              </DialogTitle>
            </DialogHeader>
            <AttendanceForm
              personType="trainee"
              personId={trainee.id}
              pno={trainee.pno}
              onSuccess={handleAttendanceSuccess}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

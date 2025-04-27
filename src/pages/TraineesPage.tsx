
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { Trainee } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TraineesPage = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTrainees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trainees')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setTrainees(data || []);
    } catch (error) {
      console.error('Error fetching trainees:', error);
      toast.error('Failed to load trainees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Trainees</h1>
          <Button onClick={() => navigate("/add-trainee")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trainee
          </Button>
        </div>
        
        <TraineeTable 
          trainees={trainees} 
          onRefresh={fetchTrainees}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default TraineesPage;


import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { EditTraineeForm } from "@/components/trainee/EditTraineeForm";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";

const EditTraineePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        if (!id) {
          toast.error(isHindi ? "प्रशिक्षु आईडी नहीं मिली" : "Trainee ID not found");
          navigate("/trainees");
          return;
        }
        
        setIsLoading(true);
        
        // Direct Supabase query to fetch a single trainee by ID
        const { data, error } = await supabase
          .from('trainees')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching trainee:", error);
          throw error;
        }
        
        if (data) {
          console.log("Trainee data fetched:", data);
          setTrainee(data as Trainee);
        } else {
          console.error("No trainee found with ID:", id);
          toast.error(isHindi ? "प्रशिक्षु नहीं मिला" : "Trainee not found");
          navigate("/trainees");
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        toast.error(isHindi ? "प्रशिक्षु लोड नहीं हो सकते" : "Failed to load trainee data");
        navigate("/trainees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, navigate, isHindi]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center dynamic-text">{isHindi ? "लोडिंग..." : "Loading trainee data..."}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!trainee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center text-red-500 dynamic-text">{isHindi ? "प्रशिक्षु नहीं मिला" : "Trainee not found"}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <EditTraineeForm 
          trainee={trainee}
          onSuccess={() => {
            navigate(`/trainees/${trainee.id}`);
          }}
        />
      </main>
    </div>
  );
};

export default EditTraineePage;

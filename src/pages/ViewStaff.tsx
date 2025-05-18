
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffById } from "@/services/staffApi";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { StaffHeader } from "@/components/staff/view/StaffHeader";
import { StaffDetailsSection } from "@/components/staff/view/StaffDetailsSection";
import { StaffLoadingState } from "@/components/staff/view/StaffLoadingState";
import { StaffNotFound } from "@/components/staff/view/StaffNotFound";
import { useStaffPrintService } from "@/components/staff/view/StaffPrintService";
import { useLanguage } from "@/contexts/LanguageContext";

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isHindi } = useLanguage();

  // Apply language inputs hook
  useLanguageInputs();

  // Get print and download functions
  const { handlePrintStaff, handleDownloadStaff, handleExcelExport, isLoading: printLoading } = useStaffPrintService(staff);
  
  const handlePrintClick = () => {
    if (printLoading) return;
    handlePrintStaff();
  };
  
  const handleDownloadClick = () => {
    if (printLoading) return;
    handleDownloadStaff();
  };
  
  const handleExcelExportClick = () => {
    if (printLoading) return;
    handleExcelExport();
  };

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) {
        toast.error(isHindi ? "स्टाफ आईडी नहीं मिली" : "Staff ID not found");
        navigate("/staff");
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await getStaffById(id);
        
        if (error) {
          console.error("Error fetching staff:", error);
          toast.error(isHindi ? "स्टाफ विवरण लोड नहीं हो सका" : "Failed to fetch staff details");
          navigate("/staff");
          return;
        }
        
        if (!data) {
          toast.error(isHindi ? "स्टाफ नहीं मिला" : "Staff not found");
          navigate("/staff");
          return;
        }
        
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error(isHindi ? "स्टाफ विवरण लोड नहीं हो सका" : "Failed to fetch staff details");
        navigate("/staff");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id, isHindi, navigate]);

  if (isLoading) {
    return <StaffLoadingState />;
  }

  if (!staff) {
    return <StaffNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <StaffHeader 
            id={id}
            staff={staff}
            onPrint={handlePrintClick}
            onDownload={handleDownloadClick}
            onExcelExport={handleExcelExportClick}
          />
          
          <StaffDetailsSection staff={staff} />
        </div>
      </main>
    </div>
  );
};

export default ViewStaff;

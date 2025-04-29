
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffById } from "@/services/staffApi";
import { Staff } from "@/types/staff";
import { format } from "date-fns";
import { toast } from "sonner";
import { Printer, Download } from "lucide-react";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { prepareTextForLanguage } from "@/utils/textUtils";

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await getStaffById(id);
        
        if (error) throw error;
        
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error(t("failedToFetchStaff", "Failed to fetch staff details"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id, t]);

  // Force re-render when language changes
  useEffect(() => {
    // This empty dependency will trigger a re-render when i18n.language changes
  }, [i18n.language]);

  const handlePrintStaff = () => {
    if (!staff) return;
    
    const content = createStaffPrintContent([staff], i18n.language, t);
    handlePrint(content);
    toast.success(t("printingStaff", "Printing staff details"));
  };

  const handleDownloadStaff = () => {
    if (!staff) return;
    
    const content = createStaffCSVContent([staff], i18n.language, t);
    handleDownload(content, `staff_${staff.pno}_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(t("staffCSVDownloaded", "Staff details downloaded as CSV"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                {t("viewStaffDetails", "View Staff Details")}
              </span>
            </h1>
          </div>
          <Card>
            <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
              <p className="text-muted-foreground">
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("loadingStaffDetails", "Loading staff details...")}
                </span>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                {t("viewStaffDetails", "View Staff Details")}
              </span>
            </h1>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("back", "Back")}
              </span>
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500 my-8">
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("staffNotFound", "Staff not found or has been deleted.")}
                </span>
              </p>
              <Button onClick={() => navigate("/staff")}>
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("returnToStaffList", "Return to Staff List")}
                </span>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
              {t("viewStaffDetails", "View Staff Details")}
            </span>
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintStaff}>
              <Printer className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("print", "Print")}
              </span>
            </Button>
            <Button variant="outline" onClick={handleDownloadStaff}>
              <Download className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("download", "Download")}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("edit", "Edit")}
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("back", "Back")}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                      {t("personalInformation", "Personal Information")}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("pno", "PNO")}
                        </span>
                      </p>
                      <p>{staff.pno}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("name", "Name")}
                        </span>
                      </p>
                      <p>
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                          {prepareTextForLanguage(staff.name, i18n.language)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("fatherName", "Father's Name")}
                        </span>
                      </p>
                      <p>
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                          {prepareTextForLanguage(staff.father_name, i18n.language)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("rank", "Rank")}
                        </span>
                      </p>
                      <p>{staff.rank}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("mobileNumber", "Mobile Number")}
                        </span>
                      </p>
                      <p>{staff.mobile_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("currentPostingDistrict", "Current Posting District")}
                        </span>
                      </p>
                      <p>
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                          {prepareTextForLanguage(staff.current_posting_district, i18n.language)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("education", "Education")}
                        </span>
                      </p>
                      <p>
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                          {prepareTextForLanguage(staff.education, i18n.language)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("bloodGroup", "Blood Group")}
                        </span>
                      </p>
                      <p>{staff.blood_group}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("nominee", "Nominee")}
                        </span>
                      </p>
                      <p>
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                          {prepareTextForLanguage(staff.nominee, i18n.language)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                      {t("dates", "Dates")}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("dateOfBirth", "Date of Birth")}
                        </span>
                      </p>
                      <p>{staff.date_of_birth ? format(new Date(staff.date_of_birth), "PPP") : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                          {t("dateOfJoining", "Date of Joining")}
                        </span>
                      </p>
                      <p>{staff.date_of_joining ? format(new Date(staff.date_of_joining), "PPP") : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                      {t("address", "Address")}
                    </span>
                  </h2>
                  <p>
                    <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                      {prepareTextForLanguage(staff.home_address, i18n.language)}
                    </span>
                  </p>
                </div>
                
                {(staff.toli_no || staff.class_no || staff.class_subject) && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                        {t("additionalInformation", "Additional Information")}
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staff.toli_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                              {t("toliNumber", "Toli Number")}
                            </span>
                          </p>
                          <p>{staff.toli_no}</p>
                        </div>
                      )}
                      {staff.class_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                              {t("classNumber", "Class Number")}
                            </span>
                          </p>
                          <p>{staff.class_no}</p>
                        </div>
                      )}
                      {staff.class_subject && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                              {t("classSubject", "Class Subject")}
                            </span>
                          </p>
                          <p>
                            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                              {prepareTextForLanguage(staff.class_subject, i18n.language)}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewStaff;

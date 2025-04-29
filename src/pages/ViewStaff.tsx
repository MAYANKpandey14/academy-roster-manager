
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
    toast.success(t("staffDetailsDownloaded", "Staff details downloaded as CSV"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold dynamic-text">{t("viewStaffDetails", "View Staff Details")}</h1>
          </div>
          <Card>
            <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
              <p className="text-muted-foreground dynamic-text">{t("loadingStaffDetails", "Loading staff details...")}</p>
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
            <h1 className="text-2xl font-semibold dynamic-text">{t("viewStaffDetails", "View Staff Details")}</h1>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              <span className="dynamic-text">{t("back", "Back")}</span>
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500 my-8 dynamic-text">{t("staffNotFound", "Staff not found or has been deleted.")}</p>
              <Button onClick={() => navigate("/staff")}>
                <span className="dynamic-text">{t("returnToStaffList", "Return to Staff List")}</span>
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
          <h1 className="text-2xl font-semibold dynamic-text">{t("viewStaffDetails", "View Staff Details")}</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintStaff}>
              <Printer className="mr-2 h-4 w-4" />
              <span className="dynamic-text">{t("print", "Print")}</span>
            </Button>
            <Button variant="outline" onClick={handleDownloadStaff}>
              <Download className="mr-2 h-4 w-4" />
              <span className="dynamic-text">{t("download", "Download")}</span>
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              <span className="dynamic-text">{t("edit", "Edit")}</span>
            </Button>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              <span className="dynamic-text">{t("back", "Back")}</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 dynamic-text">{t("personalInformation", "Personal Information")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("pno", "PNO")}</p>
                      <p>{staff.pno}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("name", "Name")}</p>
                      <p className="dynamic-text" lang={i18n.language}>{staff.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("fatherName", "Father's Name")}</p>
                      <p className="dynamic-text" lang={i18n.language}>{staff.father_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("rank", "Rank")}</p>
                      <p>{staff.rank}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("mobileNumber", "Mobile Number")}</p>
                      <p>{staff.mobile_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("currentPostingDistrict", "Current Posting District")}</p>
                      <p className="dynamic-text" lang={i18n.language}>{staff.current_posting_district}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("education", "Education")}</p>
                      <p className="dynamic-text" lang={i18n.language}>{staff.education}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("bloodGroup", "Blood Group")}</p>
                      <p>{staff.blood_group}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("nominee", "Nominee")}</p>
                      <p className="dynamic-text" lang={i18n.language}>{staff.nominee}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 dynamic-text">{t("dates", "Dates")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("dateOfBirth", "Date of Birth")}</p>
                      <p>{staff.date_of_birth ? format(new Date(staff.date_of_birth), "PPP") : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("dateOfJoining", "Date of Joining")}</p>
                      <p>{staff.date_of_joining ? format(new Date(staff.date_of_joining), "PPP") : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 dynamic-text">{t("address", "Address")}</h2>
                  <p className="dynamic-text" lang={i18n.language}>{staff.home_address}</p>
                </div>
                
                {(staff.toli_no || staff.class_no || staff.class_subject) && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 dynamic-text">{t("additionalInformation", "Additional Information")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staff.toli_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("toliNumber", "Toli Number")}</p>
                          <p>{staff.toli_no}</p>
                        </div>
                      )}
                      {staff.class_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("classNumber", "Class Number")}</p>
                          <p>{staff.class_no}</p>
                        </div>
                      )}
                      {staff.class_subject && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground dynamic-text">{t("classSubject", "Class Subject")}</p>
                          <p className="dynamic-text" lang={i18n.language}>{staff.class_subject}</p>
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

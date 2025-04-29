
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { getTrainees } from "@/services/api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Printer, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { prepareTextForLanguage } from "@/utils/textUtils";

const ViewTrainee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        const { data, error } = await getTrainees();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const traineeData = data.find(t => t.id === id);
          
          if (traineeData) {
            setTrainee(traineeData);
          } else {
            toast.error(t("traineeNotFound", "Trainee not found"));
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        toast.error(t("failedToLoadTrainee", "Failed to load trainee data"));
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, navigate, t]);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>${t("traineeInformation", "Trainee Information")} - ${trainee?.name}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 30px; }
            .trainee-info { border: 1px solid #ddd; padding: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; }
            .header p { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${t("rtcPolice", "RTC Police Line, Moradabad")}</h1>
            <p>${t("traineeInfo", "RTC Trainee Information")}</p>
          </div>
          <div class="trainee-info">
            ${trainee ? `
              <div class="field"><span class="field-label">${t("name", "Name")}:</span> ${trainee.name}</div>
              <div class="field"><span class="field-label">${t("pno", "PNO")}:</span> ${trainee.pno}</div>
              <div class="field"><span class="field-label">${t("chestNo", "Chest No")}:</span> ${trainee.chest_no}</div>
              <div class="field"><span class="field-label">${t("fatherName", "Father's Name")}:</span> ${trainee.father_name}</div>
              <div class="field"><span class="field-label">${t("dateOfBirth", "Date of Birth")}:</span> ${format(new Date(trainee.date_of_birth), 'PP')}</div>
              <div class="field"><span class="field-label">${t("dateOfJoining", "Date of Joining")}:</span> ${format(new Date(trainee.date_of_joining), 'PP')}</div>
              <div class="field"><span class="field-label">${t("trainingPeriod", "Training Period")}:</span> ${format(new Date(trainee.arrival_date), 'PP')} to ${format(new Date(trainee.departure_date), 'PP')}</div>
              <div class="field"><span class="field-label">${t("currentPosting", "Current Posting")}:</span> ${trainee.current_posting_district}</div>
              <div class="field"><span class="field-label">${t("mobile", "Mobile")}:</span> ${trainee.mobile_number}</div>
              <div class="field"><span class="field-label">${t("education", "Education")}:</span> ${trainee.education}</div>
              <div class="field"><span class="field-label">${t("bloodGroup", "Blood Group")}:</span> ${trainee.blood_group}</div>
              <div class="field"><span class="field-label">${t("nominee", "Nominee")}:</span> ${trainee.nominee}</div>
              <div class="field"><span class="field-label">${t("homeAddress", "Home Address")}:</span> ${trainee.home_address}</div>
            ` : ''}
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            <p>${t("documentGenerated", "This document was generated on")} ${format(new Date(), 'PP')} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast.error(t("failedToPrint", "Failed to open print window. Please check your pop-up blocker settings."));
    }
  };

  const handleDownload = () => {
    if (!trainee) return;

    const headers = [
      t("pno", "PNO"), 
      t("chestNo", "Chest No"), 
      t("name", "Name"), 
      t("fatherName", "Father's Name"), 
      t("arrivalDate", "Arrival Date"),
      t("departureDate", "Departure Date"), 
      t("currentPostingDistrict", "Current Posting District"), 
      t("mobileNumber", "Mobile Number"),
      t("education", "Education"), 
      t("dateOfBirth", "Date of Birth"), 
      t("dateOfJoining", "Date of Joining"), 
      t("bloodGroup", "Blood Group"),
      t("nominee", "Nominee"), 
      t("homeAddress", "Home Address")
    ];
    
    const values = [
      trainee.pno,
      trainee.chest_no,
      trainee.name,
      trainee.father_name,
      format(new Date(trainee.arrival_date), 'PP'),
      format(new Date(trainee.departure_date), 'PP'),
      trainee.current_posting_district,
      trainee.mobile_number,
      trainee.education,
      format(new Date(trainee.date_of_birth), 'PP'),
      format(new Date(trainee.date_of_joining), 'PP'),
      trainee.blood_group,
      trainee.nominee,
      trainee.home_address
    ];
    
    const csvContent = headers.join(',') + '\n' + values.join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(t("csvDownloaded", "CSV file downloaded successfully"));
  };

  // Helper function to render text in the current language
  const renderText = (text: string) => {
    return <span className="dynamic-text">{prepareTextForLanguage(text, i18n.language)}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center dynamic-text">{t("loading", "Loading trainee data...")}</p>
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
            <p className="text-center text-red-500 dynamic-text">{t("traineeNotFound", "Trainee not found")}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dynamic-text">{t("traineeDetails", "Trainee Details")}</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="print-button"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                <span className="dynamic-text">{t("print", "Print")}</span>
              </Button>
              <Button 
                variant="outline"
                className="download-button"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="dynamic-text">{t("downloadCSV", "Download CSV")}</span>
              </Button>
              <Button 
                onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className="dynamic-text">{t("editTrainee", "Edit Trainee")}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("pno", "PNO")}</h3>
                <p className="mt-1">{trainee.pno}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("chestNo", "Chest No")}</h3>
                <p className="mt-1">{trainee.chest_no}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("name", "Name")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("fatherName", "Father's Name")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.father_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("currentPostingDistrict", "Current Posting District")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.current_posting_district}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("mobileNumber", "Mobile Number")}</h3>
                <p className="mt-1">{trainee.mobile_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("education", "Education")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.education}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("bloodGroup", "Blood Group")}</h3>
                <p className="mt-1">{trainee.blood_group}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("nominee", "Nominee")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.nominee}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("homeAddress", "Home Address")}</h3>
                <p className="mt-1 dynamic-text" lang={i18n.language}>{trainee.home_address}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("dateOfBirth", "Date of Birth")}</h3>
                <p className="mt-1">{format(new Date(trainee.date_of_birth), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("dateOfJoining", "Date of Joining")}</h3>
                <p className="mt-1">{format(new Date(trainee.date_of_joining), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dynamic-text">{t("trainingPeriod", "Training Period")}</h3>
                <p className="mt-1">
                  {format(new Date(trainee.arrival_date), 'PP')} - {format(new Date(trainee.departure_date), 'PP')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;

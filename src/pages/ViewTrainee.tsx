
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
  
  // Apply language inputs hook - make sure it runs on language change
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
        toast.error(t("failedToFetchTrainee", "Failed to load trainee data"));
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, navigate, t]);

  // Force re-render when language changes
  useEffect(() => {
    // This empty dependency will trigger a re-render when i18n.language changes
  }, [i18n.language]);

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
            ${i18n.language === 'hi' ? `
              @font-face {
                font-family: 'KrutiDev';
                src: url('/font/KrutiDev.woff') format('woff');
                font-weight: normal;
                font-style: normal;
              }
              .hindi-text {
                font-family: 'KrutiDev', sans-serif;
              }
            ` : ''}
          </style>
        </head>
        <body class="${i18n.language === 'hi' ? 'hindi-text' : ''}">
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("loadingTraineeDetails", "Loading trainee data...")}
              </span>
            </p>
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
            <p className="text-center text-red-500">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                {t("traineeNotFound", "Trainee not found")}
              </span>
            </p>
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
            <h1 className="text-2xl font-bold">
              <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
                {t("traineeDetails", "Trainee Details")}
              </span>
            </h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="print-button"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("print", "Print")}
                </span>
              </Button>
              <Button 
                variant="outline"
                className="download-button"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("downloadCSV", "Download CSV")}
                </span>
              </Button>
              <Button 
                onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                  {t("editTrainee", "Edit Trainee")}
                </span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("pno", "PNO")}
                  </span>
                </h3>
                <p className="mt-1">{trainee.pno}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("chestNo", "Chest No")}
                  </span>
                </h3>
                <p className="mt-1">{trainee.chest_no}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("name", "Name")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.name, i18n.language)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("fatherName", "Father's Name")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.father_name, i18n.language)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("currentPostingDistrict", "Current Posting District")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.current_posting_district, i18n.language)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("mobileNumber", "Mobile Number")}
                  </span>
                </h3>
                <p className="mt-1">{trainee.mobile_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("education", "Education")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.education, i18n.language)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("bloodGroup", "Blood Group")}
                  </span>
                </h3>
                <p className="mt-1">{trainee.blood_group}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("nominee", "Nominee")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.nominee, i18n.language)}
                  </span>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("homeAddress", "Home Address")}
                  </span>
                </h3>
                <p className="mt-1">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
                    {prepareTextForLanguage(trainee.home_address, i18n.language)}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("dateOfBirth", "Date of Birth")}
                  </span>
                </h3>
                <p className="mt-1">{format(new Date(trainee.date_of_birth), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("dateOfJoining", "Date of Joining")}
                  </span>
                </h3>
                <p className="mt-1">{format(new Date(trainee.date_of_joining), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
                    {t("trainingPeriod", "Training Period")}
                  </span>
                </h3>
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

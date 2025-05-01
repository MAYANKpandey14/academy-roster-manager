import { Staff } from "@/types/staff";
import { createStaffCSVContent, handleDownload } from "@/utils/staffExportUtils";
import { createPrintWindow } from "@/utils/printUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StaffPrintServiceProps {
  staff: Staff;
}

export function useStaffPrintService(staff: Staff) {
  const { isHindi } = useLanguage();

  const t = (key: string, fallback: string) => {
    const translations: Record<string, string> = {
      printError: isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.",
      printSuccess: isHindi ? "स्टाफ विवरण प्रिंट हो रहा है..." : "Printing staff details",
      downloadSuccess: isHindi ? "स्टाफ CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : "CSV file downloaded successfully",
      staffInfo: isHindi ? "आरटीसी स्टाफ जानकारी" : "RTC Staff Information",
      name: isHindi ? "नाम" : "Name",
      pno: isHindi ? "पीएनओ" : "PNO",
      rank: isHindi ? "रैंक" : "Rank",
      fatherName: isHindi ? "पिता का नाम" : "Father's Name",
      dateOfBirth: isHindi ? "जन्म तिथि" : "Date of Birth",
      dateOfJoining: isHindi ? "शामिल होने की तिथि" : "Date of Joining",
      currentPosting: isHindi ? "वर्तमान पोस्टिंग" : "Current Posting",
      mobile: isHindi ? "मोबाइल" : "Mobile",
      education: isHindi ? "शिक्षा" : "Education",
      bloodGroup: isHindi ? "रक्त समूह" : "Blood Group",
      nominee: isHindi ? "नौमिनी " : "Nominee",
      homeAddress: isHindi ? "घर का पता" : "Home Address",
      documentGenerated: isHindi ? "यह दस्तावेज़ बनाया गया था" : "This document was generated on"
    };
    return translations[key] || fallback;
  };

  const handlePrintStaff = () => {
    const headerInfo = [
      { label: t('name', 'Name'), value: staff.name },
      { label: t('pno', 'PNO'), value: staff.pno },
      { label: t('rank', 'Rank'), value: staff.rank },
      { label: t('fatherName', 'Father\'s Name'), value: staff.father_name },
      { label: t('dateOfBirth', 'Date of Birth'), value: staff.date_of_birth },
      { label: t('dateOfJoining', 'Date of Joining'), value: staff.date_of_joining },
      { label: t('currentPosting', 'Current Posting'), value: staff.current_posting },
      { label: t('mobile', 'Mobile'), value: staff.mobile_number },
      { label: t('education', 'Education'), value: staff.education },
      { label: t('bloodGroup', 'Blood Group'), value: staff.blood_group },
      { label: t('nominee', 'Nominee'), value: staff.nominee },
      { label: t('homeAddress', 'Home Address'), value: staff.home_address }
    ];

    const printSuccess = createPrintWindow({
      title: t('staffInfo', 'RTC Staff Information'),
      content: `<div class="document-info">${t('documentGenerated', 'This document was generated on')} ${new Date().toLocaleDateString()}</div>`,
      headerInfo
    });
    
    if (!printSuccess) {
      toast.error(t('printError', 'Failed to open print window'));
    } else {
      toast.success(t('printSuccess', 'Printing staff details'));
    }
  };

  const handleDownloadStaff = () => {
    const csvContent = createStaffCSVContent([staff], isHindi ? 'hi' : 'en');
    handleDownload(
      csvContent, 
      `staff_${staff.pno}_${staff.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(t('downloadSuccess', 'CSV file downloaded successfully'));
  };

  return {
    handlePrintStaff,
    handleDownloadStaff
  };
}

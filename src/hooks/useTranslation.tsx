import { useLanguage } from '@/contexts/LanguageContext';

// Simplified translation hook that always uses Hindi
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  // Create a simple translation function that returns Hindi text
  const t = (key: string, fallback?: string) => {
    // Hindi translations can be expanded as needed
    const translations: Record<string, string> = {
      // Common translations
      "headerTitle": "पुलिस प्रशिक्षण अकादमी",
      "back": "वापस जाएं",
      "home": "होम",
      "logout": "लॉग आउट",
      "processing": "प्रोसेसिंग...",
      "signIn": "साइन इन",
      "emailAddress": "ईमेल एड्रेस",
      "password": "पासवर्ड",

      // Trainee fields
      "trainees": "प्रशिक्षु",
      "staff": "स्टाफ",
      "attendance": "उपस्थिति",
      "leave": "छुट्टी",
      "pno": "पीएनओ",
      "chestNo": "चेस्ट नंबर",
      "name": "नाम",
      "fatherName": "पिता का नाम",
      "dateOfBirth": "जन्म तिथि",
      "dateOfJoining": "नियुक्ति तिथि",
      "dateOfArrival": "आगमन तिथि",
      "dateOfDeparture": "प्रस्थान तिथि",
      "currentPostingDistrict": "वर्तमान तैनाती जिला",
      "mobileNumber": "मोबाइल नंबर",
      "education": "शिक्षा",
      "bloodGroup": "रक्त समूह",
      "nominee": "नामिती",
      "homeAddress": "घर का पता",
      "traineeDetails": "प्रशिक्षु विवरण",
      "print": "प्रिंट",
      "download": "डाउनलोड",
      "downloadCSV": "सीएसवी डाउनलोड",
      "editTrainee": "प्रशिक्षु संपादित करें",
      "view": "देखें",
      "edit": "संपादित करें",
      "search": "खोजें",
      "of": "में से",
      "rowsSelected": "पंक्तियां चयनित",
      "refresh": "रिफ्रेश",
      "selected": "चयनित",
      "chestNumber": "चेस्ट नंबर",
      "currentPosting": "वर्तमान तैनाती",
      "trainingStarts": "प्रशिक्षण आरंभ",
      "trainingPeriod": "प्रशिक्षण अवधि",
      "trainingPeriodTo": "से",
      "searchByName": "नाम से खोजें...",

      // Staff
      "searchStaff": "स्टाफ खोजें",
      "pnoNumber": "पीएनओ नंबर",
      "enterPNO": "पीएनओ दर्ज करें",
      "addStaff": "स्टाफ जोड़ें",
      "showAllStaff": "सभी स्टाफ दिखाएं",
      "staffDetails": "स्टाफ विवरण",
      
      // Auth
      "signInToAccount": "अपने अकाउंट में साइन इन करें",
      "resetPassword": "पा���वर्ड रीसेट करें",
      "sendResetLink": "रीसेट लिंक भेजें",
      "forgotPassword": "पासवर्ड भूल गए?",
      "backToLogin": "लॉगिन पर वापस जाएं",
      "logoutSuccess": "आप सफलतापूर्वक लॉगआउट हो गए हैं",
      "passwordUpdated": "पासवर्ड अपडेट किया गया",

      // Attendance & Leave
      "status": "स्थिति",
      "absent": "अनुपस्थित",
      "onLeave": "छुट्टी पर",
      "date": "तिथि",
      "markAttendance": "उपस्थिति दर्ज करें",
      "startDate": "आरंभ तिथि",
      "endDate": "समापन तिथि",
      "reasonForLeave": "छुट्टी का कारण",
      "enterReason": "कारण दर्ज करें",
      "submitLeaveRequest": "छुट्टी अनुरोध जमा करें",

      // Others
      "rtcPolice": "आरटीसी पुलिस लाइन, मुरादाबाद",
      "traineeInfo": "प्रशिक्षु जानकारी",
      "documentGenerated": "यह दस्तावेज़ उत्पन्न किया गया",
      "mobile": "मोबाइल",
      
      // Add more translations as needed...
    };

    return translations[key] || fallback || key;
  };

  return {
    t,
    i18n: {
      language: currentLanguage
    }
  };
};

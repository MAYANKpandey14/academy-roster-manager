
// This custom hook now always returns Hindi text
export function useTranslation() {
  // Hindi translations for our application
  const translations = {
    // Authentication
    login: "लॉग इन",
    signup: "साइन अप",
    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    resetPassword: "पासवर्ड रीसेट करें",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    newPassword: "नया पासवर्ड",
    resetYourPassword: "अपना पासवर्ड रीसेट करें",
    processing: "प्रोसेसिंग...",
    updatePassword: "पासवर्ड अपडेट करें",
    passwordUpdated: "पासवर्ड अपडेट किया गया",
    
    // Navigation
    back: "वापस",
    home: "होम",
    logout: "लॉग आउट",
    logoutSuccess: "सफलतापूर्वक लॉग आउट कर दिया गया",
    
    // Trainee Management
    trainees: "प्रशिक्षु",
    addNewTrainee: "नया प्रशिक्षु जोड़ें",
    traineeDetails: "प्रशिक्षु विवरण",
    editTrainee: "प्रशिक्षु संपादित करें",
    traineeAdded: "प्रशिक्षु सफलतापूर्वक जोड़ा गया",
    viewTraineeDetails: "प्रशिक्षु विवरण देखें",
    traineeNotFound: "प्रशिक्षु नहीं मिला या हटा दिया गया है",
    returnToTraineeList: "प्रशिक्षु सूची पर वापस जाएं",
    loadingTraineeDetails: "प्रशिक्षु डेटा लोड हो रहा है...",
    pno: "पीएनओ",
    chestNo: "चेस्ट नंबर",
    name: "नाम",
    fatherName: "पिता का नाम",
    dateOfArrival: "आगमन की तारीख",
    dateOfDeparture: "प्रस्थान की तारीख",
    currentPostingDistrict: "वर्तमान तैनाती जिला",
    mobileNumber: "मोबाइल नंबर",
    education: "शिक्षा",
    dateOfBirth: "जन्म तिथि",
    dateOfJoining: "नियुक्ति तिथि",
    bloodGroup: "रक्त समूह",
    nominee: "नामिती",
    homeAddress: "घर का पता",
    trainingPeriod: "प्रशिक्षण अवधि",
    
    // Staff Management
    staff: "स्टाफ",
    addStaff: "स्टाफ जोड़ें",
    editStaff: "स्टाफ संपादित करें",
    addNewStaff: "नया स्टाफ जोड़ें",
    staffAddedSuccessfully: "स्टाफ सफलतापूर्वक जोड़ा गया",
    staffUpdatedSuccessfully: "स्टाफ सफलतापूर्वक अपडेट किया गया",
    viewStaffDetails: "स्टाफ विवरण देखें",
    searchStaff: "स्टाफ खोजें",
    staffNotFound: "स्टाफ नहीं मिला या हटा दिया गया है",
    returnToStaffList: "स्टाफ सूची पर वापस जाएं",
    loadingStaffDetails: "स्टाफ विवरण लोड हो रहा है...",
    
    // Common Form Fields
    save: "सेव करें",
    cancel: "रद्द करें",
    saving: "सेव हो रहा है...",
    loading: "लोड हो रहा है...",
    search: "खोजें",
    edit: "संपादित करें",
    view: "देखें",
    print: "प्रिंट",
    download: "डाउनलोड",
    downloadCSV: "CSV डाउनलोड",
    
    // Table Actions
    selectTraineesToPrint: "प्रिंट के लिए कम से कम एक प्रशिक्षु का चयन करें",
    printingTrainees: "प्रशिक्षु(ओं) का प्रिंट हो रहा है",
    failedToPrint: "प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।",
    selectTraineesToDownload: "डाउनलोड के लिए कम से कम एक प्रशिक्षु का चयन करें",
    traineeCSVDownloaded: "प्रशिक्षुओं वाली CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई",
    printSelected: "चयनित प्रिंट करें",
    selected: "चयनित",
    refresh: "रिफ्रेश",
    
    // Search and Filters
    pnoNumber: "पीएनओ नंबर",
    enterPNO: "पीएनओ दर्ज करें (9-अंक)",
    chestNumber: "चेस्ट नंबर",
    enterChestNo: "चेस्ट नंबर दर्ज करें",
    rollNo: "रोल नंबर",
    enterRollNo: "रोल नंबर / विशिष्ट आईडी दर्ज करें",
    searchTrainees: "प्रशिक्षुओं की खोज",
    showAllTrainees: "सभी प्रशिक्षु दिखाएं",
    searchTraineeBtn: "प्रशिक्षु खोजें",
    searchByName: "नाम से खोजें...",
    
    // Attendance and Leave
    attendanceManagement: "उपस्थिति प्रबंधन",
    traineeAttendance: "प्रशिक्षु उपस्थिति",
    staffAttendance: "स्टाफ उपस्थिति",
    markTraineeAttendance: "प्रशिक्षु उपस्थिति चिह्नित करें",
    markStaffAttendance: "स्टाफ उपस्थिति चिह्नित करें",
    leaveManagement: "अवकाश प्रबंधन",
    traineeLeave: "प्रशिक्षु अवकाश",
    staffLeave: "स्टाफ अवकाश",
    submitTraineeLeaveRequest: "प्रशिक्षु अवकाश अनुरोध जमा करें",
    submitStaffLeaveRequest: "स्टाफ अवकाश अनुरोध जमा करें",
    
    // Staff Info Fields
    personalInformation: "व्यक्तिगत जानकारी",
    additionalInformation: "अतिरिक्त जानकारी",
    dates: "तिथियां",
    address: "पता",
    rank: "रैंक",
    toliNumber: "टोली नंबर",
    classNumber: "कक्षा नंबर",
    classSubject: "कक्षा विषय",
    
    // Table Headers
    currentPosting: "वर्तमान पोस्टिंग",
    trainingStarts: "प्रशिक्षण शुरू",
    
    // Welcome Page
    headerTitle: "आरटीसी प्रशिक्षु प्रबंधन प्रणाली",
    openDashboard: "डैशबोर्ड खोलें",
    
    // Error Messages
    error: "एक त्रुटि उत्पन्न हुई",
    failedToAddStaff: "स्टाफ जोड़ने में विफल",
    failedToUpdateStaff: "स्टाफ अपडेट करने में विफल",
    failedToLoadStaffDetails: "स्टाफ विवरण लोड करने में विफल",
    failedToFetchStaff: "स्टाफ विवरण प्राप्त करने में विफल",
    failedToLoadTrainee: "प्रशिक्षु डेटा लोड करने में विफल",
    failedToFetchTrainee: "प्रशिक्षु डेटा प्राप्त करने में विफल",
    failedToSaveTrainee: "प्रशिक्षु डेटा सेव करने में विफल। कृपया पुनः प्रयास करें।",
    noResults: "आपके खोज मानदंडों से मेल खाने वाला कोई प्रशिक्षु नहीं मिला",
    showAllStaff: "सभी स्टाफ दिखाएं",
    totalStaff: "कुल स्टाफ",
    
    // Welcome page text
    welcomeText: "राजकीय प्रशिक्षण केंद्र प्रशिक्षु प्रबंधन प्रणाली में आपका स्वागत है",
  };

  // Function to get a translated string
  const t = (key: string, fallback?: string): string => {
    return translations[key as keyof typeof translations] || fallback || key;
  };

  // Return translation function and current language (always Hindi)
  return { t, i18n: { language: 'hi' } };
}

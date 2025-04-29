
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translation keys
interface TranslationKeys {
  // General UI
  welcome: string;
  loading: string;
  error: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  back: string;
  yes: string;
  no: string;
  confirm: string;
  success: string;
  failure: string;

  // Authentication
  login: string;
  logout: string;
  username: string;
  password: string;
  forgotPassword: string;
  resetPassword: string;
  signIn: string;
  sendResetLink: string;
  backToLogin: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  passwordUpdated: string;
  openDashboard: string;

  // Main Navigation
  trainees: string;
  staff: string;
  attendance: string;
  leave: string;
  dashboard: string;

  // CRUD Operations
  addTrainee: string;
  editTrainee: string;
  viewTrainee: string;
  addStaff: string;
  editStaff: string;
  viewStaff: string;
  name: string;
  email: string;
  phone: string;
  address: string;

  // Header and Navigation
  headerTitle: string;
  home: string;
  logoutSuccess: string;
  logoutError: string;
  
  // Form Fields - Person Information
  pno: string;
  chestNo: string;
  fatherName: string;
  dateOfArrival: string;
  dateOfDeparture: string;
  currentPostingDistrict: string;
  mobileNumber: string;
  education: string;
  dateOfBirth: string;
  dateOfJoining: string;
  bloodGroup: string;
  nominee: string;
  homeAddress: string;
  
  // Actions
  processing: string;
  search: string;
  showAll: string;
  refresh: string;
  printAll: string;
  downloadAll: string;
  print: string;
  download: string;
  printSelected: string;
  downloadCSV: string;
  selected: string;

  // Auth and Password Reset
  emailAddress: string;
  resetYourPassword: string;
  signInToAccount: string;

  // Search Forms
  searchTrainee: string;
  searchTrainees: string;
  searchStaff: string;
  pnoNumber: string;
  chestNumber: string;
  rollNo: string;
  uniqueId: string;
  addNewTrainee: string;
  showAllTrainees: string;
  showAllStaff: string;
  searchTraineeBtn: string;
  enterPNO: string;
  enterChestNo: string;
  enterRollNo: string;

  // Table Elements
  rowsPerPage: string;
  totalTrainees: string;
  totalStaff: string;
  page: string;
  of: string;
  noResults: string;
  rowsSelected: string;

  // Table Columns
  district: string;
  arrivalDate: string;
  departureDate: string;
  mobile: string;
  actions: string;
  rank: string;
  postingDistrict: string;

  // View Details Page
  traineeDetails: string;
  staffDetails: string;
  viewStaffDetails: string;
  personalInformation: string;
  additionalInformation: string;
  dates: string;
  toliNumber: string;
  classNumber: string;
  classSubject: string;
  traineeNotFound: string;
  staffNotFound: string;
  failedToFetchTrainee: string;
  failedToFetchStaff: string;
  loadingTraineeDetails: string;
  loadingStaffDetails: string;
  returnToTraineeList: string;
  returnToStaffList: string;

  // Training Period
  trainingPeriod: string;
  trainingPeriodFrom: string;
  trainingPeriodTo: string;

  // Print and Export
  documentGenerated: string;
  printingTrainees: string;
  printingStaff: string;
  traineeCSVDownloaded: string;
  staffCSVDownloaded: string;
  selectTraineesToPrint: string;
  selectTraineesToDownload: string;
  failedToPrint: string;
  csvDownloaded: string;
  searchByName: string;
  rtcPolice: string;
  traineeInfo: string;
  currentPosting: string;

  // Attendance Management
  markAttendance: string;
  markTraineeAttendance: string;
  markStaffAttendance: string;
  attendanceManagement: string;
  traineeAttendance: string;
  staffAttendance: string;
  date: string;
  status: string;
  absent: string;
  onLeave: string;
  present: string;

  // Leave Management
  leaveManagement: string;
  traineeLeave: string;
  staffLeave: string;
  submitTraineeLeaveRequest: string;
  submitStaffLeaveRequest: string;
  startDate: string;
  endDate: string;
  reasonForLeave: string;
  submitLeaveRequest: string;
  enterReason: string;
}

interface Resources {
  [lang: string]: {
    translation: Partial<TranslationKeys>;
  };
}

const resources: Resources = {
  en: {
    translation: {
      // General UI
      welcome: "Welcome to RTC Police Line Management System",
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      back: "Back",
      yes: "Yes",
      no: "No",
      confirm: "Confirm",
      success: "Success",
      failure: "Failure",

      // Authentication
      login: "Login",
      logout: "Logout",
      username: "Username",
      password: "Password",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      signIn: "Sign in",
      sendResetLink: "Send reset link",
      backToLogin: "Back to login",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      updatePassword: "Update Password",
      passwordUpdated: "Password updated successfully!",
      openDashboard: "Open Dashboard",

      // Main Navigation
      trainees: "Trainees",
      staff: "Staff",
      attendance: "Attendance",
      leave: "Leave",
      dashboard: "Dashboard",

      // CRUD Operations
      addTrainee: "Add Trainee",
      editTrainee: "Edit Trainee",
      viewTrainee: "View Trainee",
      addStaff: "Add Staff",
      editStaff: "Edit Staff",
      viewStaff: "View Staff",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",

      // Header and Navigation
      headerTitle: "RTC TRAINING CENTRE POLICE LINE, MORADABAD",
      home: "Home",
      logoutSuccess: "Logged out successfully",
      logoutError: "Error logging out",
      
      // Form Fields - Person Information
      pno: "PNO",
      chestNo: "Chest No",
      fatherName: "Father's Name",
      dateOfArrival: "Date of Arrival",
      dateOfDeparture: "Date of Departure",
      currentPostingDistrict: "Current Posting District",
      mobileNumber: "Mobile Number",
      education: "Education",
      dateOfBirth: "Date of Birth",
      dateOfJoining: "Date of Joining",
      bloodGroup: "Blood Group",
      nominee: "Nominee",
      homeAddress: "Home Address",
      
      // Actions
      processing: "Processing...",
      search: "Search",
      showAll: "Show All",
      refresh: "Refresh",
      printAll: "Print All",
      downloadAll: "Download All",
      print: "Print",
      download: "Download",
      printSelected: "Print Selected",
      downloadCSV: "Download CSV",
      selected: "Selected",
      
      // Auth and Password Reset
      emailAddress: "Email address",
      resetYourPassword: "Reset your password",
      signInToAccount: "Sign in to your account",

      // Search Forms
      searchTrainee: "Search Trainee",
      searchTrainees: "Search Trainees",
      searchStaff: "Search Staff",
      pnoNumber: "PNO Number",
      chestNumber: "Chest Number",
      rollNo: "Roll No",
      uniqueId: "/ Unique Id",
      addNewTrainee: "Add Trainee",
      showAllTrainees: "Show All Trainees", 
      showAllStaff: "Show All Staff",
      searchTraineeBtn: "Search Trainee",
      enterPNO: "Enter PNO (9-digit)",
      enterChestNo: "Enter Chest No (4-digit)",
      enterRollNo: "Enter Roll No / Unique ID (12-digit)",

      // Table Elements
      rowsPerPage: "Rows per page",
      totalTrainees: "trainee(s) total",
      totalStaff: "staff member(s) total",
      page: "Page",
      of: "of",
      noResults: "No results found.",
      rowsSelected: "row(s) selected",

      // Table Columns
      district: "District",
      arrivalDate: "Arrival Date",
      departureDate: "Departure Date",
      mobile: "Mobile",
      actions: "Actions",
      rank: "Rank",
      postingDistrict: "Posting District",

      // View Details Page
      traineeDetails: "Trainee Details",
      staffDetails: "Staff Details",
      viewStaffDetails: "View Staff Details",
      personalInformation: "Personal Information",
      additionalInformation: "Additional Information",
      dates: "Dates",
      toliNumber: "Toli Number",
      classNumber: "Class Number",
      classSubject: "Class Subject",
      traineeNotFound: "Trainee not found or has been deleted.",
      staffNotFound: "Staff not found or has been deleted.",
      failedToFetchTrainee: "Failed to fetch trainee details",
      failedToFetchStaff: "Failed to fetch staff details",
      loadingTraineeDetails: "Loading trainee details...",
      loadingStaffDetails: "Loading staff details...",
      returnToTraineeList: "Return to Trainee List",
      returnToStaffList: "Return to Staff List",

      // Training Period
      trainingPeriod: "Training Period",
      trainingPeriodFrom: "From",
      trainingPeriodTo: "To",

      // Print and Export
      documentGenerated: "This document was generated on",
      printingTrainees: "Printing trainee(s)",
      printingStaff: "Printing staff member(s)",
      traineeCSVDownloaded: "CSV file with trainee(s) downloaded successfully",
      staffCSVDownloaded: "CSV file with staff member(s) downloaded successfully",
      selectTraineesToPrint: "Please select at least one trainee to print",
      selectTraineesToDownload: "Please select at least one trainee to download",
      failedToPrint: "Failed to open print window. Please check your pop-up blocker settings.",
      csvDownloaded: "CSV file downloaded successfully",
      searchByName: "Search by name...",
      rtcPolice: "RTC Police Line, Moradabad",
      traineeInfo: "RTC Trainee Information",
      currentPosting: "Current Posting",

      // Attendance and Leave Management
      markAttendance: "Mark Attendance",
      markTraineeAttendance: "Mark Trainee Attendance",
      markStaffAttendance: "Mark Staff Attendance",
      attendanceManagement: "Attendance Management",
      traineeAttendance: "Trainee Attendance",
      staffAttendance: "Staff Attendance",
      date: "Date",
      status: "Status",
      absent: "Absent",
      onLeave: "On Leave",
      present: "Present",

      // Leave Management
      leaveManagement: "Leave Management",
      traineeLeave: "Trainee Leave",
      staffLeave: "Staff Leave", 
      submitTraineeLeaveRequest: "Submit Trainee Leave Request",
      submitStaffLeaveRequest: "Submit Staff Leave Request",
      startDate: "Start Date",
      endDate: "End Date",
      reasonForLeave: "Reason For Leave",
      submitLeaveRequest: "Submit Leave Request",
      enterReason: "Enter reason for leave"
    },
  },
  hi: {
    translation: {
      // General UI
      welcome: "आरटीसी पुलिस लाइन प्रबंधन प्रणाली में आपका स्वागत है",
      loading: "लोड हो रहा है...",
      error: "एक त्रुटि हुई",
      save: "सहेजें",
      cancel: "रद्द करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      view: "देखें",
      back: "वापस",
      yes: "हां",
      no: "नहीं",
      confirm: "पुष्टि करें",
      success: "सफलता",
      failure: "विफलता",

      // Authentication
      login: "लॉग इन करें",
      logout: "लॉग आउट",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      forgotPassword: "पासवर्ड भूल गए?",
      resetPassword: "पासवर्ड रीसेट करें",
      signIn: "साइन इन करें",
      sendResetLink: "रीसेट लिंक भेजें",
      backToLogin: "लॉगिन पर वापस जाएं",
      newPassword: "नया पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      updatePassword: "पासवर्ड अपडेट करें",
      passwordUpdated: "पासवर्ड सफलतापूर्वक अपडेट किया गया!",
      openDashboard: "डैशबोर्ड खोलें",

      // Main Navigation
      trainees: "प्रशिक्षु",
      staff: "स्टाफ",
      attendance: "उपस्थिति",
      leave: "अवकाश",
      dashboard: "डैशबोर्ड",

      // CRUD Operations
      addTrainee: "प्रशिक्षु जोड़ें",
      editTrainee: "प्रशिक्षु संपादित करें",
      viewTrainee: "प्रशिक्षु देखें",
      addStaff: "स्टाफ जोड़ें",
      editStaff: "स्टाफ संपादित करें",
      viewStaff: "स्टाफ देखें",
      name: "नाम",
      email: "ईमेल",
      phone: "फोन",
      address: "पता",

      // Header and Navigation
      headerTitle: "आरटीसी ट्रेनिंग सेंटर पुलिस लाइन, मुरादाबाद",
      home: "होम",
      logoutSuccess: "सफलतापूर्वक लॉगआउट किया गया",
      logoutError: "लॉगआउट करने में त्रुटि",
      
      // Form Fields - Person Information
      pno: "पीएनओ",
      chestNo: "छाती संख्या",
      fatherName: "पिता का नाम",
      dateOfArrival: "आगमन की तिथि",
      dateOfDeparture: "प्रस्थान की तिथि",
      currentPostingDistrict: "वर्तमान पोस्टिंग जिला",
      mobileNumber: "मोबाइल नंबर",
      education: "शिक्षा",
      dateOfBirth: "जन्म तिथि",
      dateOfJoining: "शामिल होने की तारीख",
      bloodGroup: "रक्त समूह",
      nominee: "नामिती",
      homeAddress: "घर का पता",
      
      // Actions
      processing: "प्रोसेसिंग...",
      search: "खोज",
      showAll: "सभी दिखाएं",
      refresh: "रिफ्रेश",
      printAll: "सभी प्रिंट करें",
      downloadAll: "सभी डाउनलोड करें",
      print: "प्रिंट",
      download: "डाउनलोड",
      printSelected: "चयनित प्रिंट करें",
      downloadCSV: "CSV डाउनलोड करें",
      selected: "चयनित",
      
      // Auth and Password Reset
      emailAddress: "ईमेल पता",
      resetYourPassword: "अपना पासवर्ड रीसेट करें",
      signInToAccount: "अपने खाते में साइन इन करें",
      
      // Search Forms
      searchTrainee: "प्रशिक्षु खोजें",
      searchTrainees: "प्रशिक्षुओं को खोजें",
      searchStaff: "स्टाफ खोजें",
      pnoNumber: "पीएनओ नंबर",
      chestNumber: "छाती संख्या",
      rollNo: "रोल नंबर",
      uniqueId: "/ विशिष्ट आईडी",
      addNewTrainee: "प्रशिक्षु जोड़ें",
      showAllTrainees: "सभी प्रशिक्षु दिखाएं",
      showAllStaff: "सभी स्टाफ दिखाएं",
      searchTraineeBtn: "प्रशिक्षु खोजें",
      enterPNO: "पीएनओ दर्ज करें (9-अंक)",
      enterChestNo: "छाती संख्या दर्ज करें (4-अंक)",
      enterRollNo: "रोल नंबर / विशिष्ट आईडी दर्ज करें (12-अंक)",
      
      // Table Elements
      rowsPerPage: "प्रति पेज पंक्तियां",
      totalTrainees: "कुल प्रशिक्षु",
      totalStaff: "कुल स्टाफ सदस्य",
      page: "पेज",
      of: "का",
      noResults: "कोई परिणाम नहीं मिला।",
      rowsSelected: "पंक्तियां चयनित",
      
      // Table Columns
      district: "जिला",
      arrivalDate: "आगमन तिथि",
      departureDate: "प्रस्थान तिथि",
      mobile: "मोबाइल",
      actions: "कार्रवाई",
      rank: "रैंक",
      postingDistrict: "पोस्टिंग जिला",
      
      // View Details Page
      traineeDetails: "प्रशिक्षु विवरण",
      staffDetails: "स्टाफ विवरण",
      viewStaffDetails: "स्टाफ विवरण देखें",
      personalInformation: "व्यक्तिगत जानकारी",
      additionalInformation: "अतिरिक्त जानकारी",
      dates: "तिथियां",
      toliNumber: "टोली नंबर",
      classNumber: "कक्षा संख्या",
      classSubject: "कक्षा विषय",
      traineeNotFound: "प्रशिक्षु नहीं मिला या हटा दिया गया है।",
      staffNotFound: "स्टाफ नहीं मिला या हटा दिया गया है।",
      failedToFetchTrainee: "प्रशिक्षु विवरण प्राप्त करने में विफल",
      failedToFetchStaff: "स्टाफ विवरण प्राप्त करने में विफल",
      loadingTraineeDetails: "प्रशिक्षु विवरण लोड हो रहा है...",
      loadingStaffDetails: "स्टाफ विवरण लोड हो रहा है...",
      returnToTraineeList: "प्रशिक्षु सूची पर वापस जाएं",
      returnToStaffList: "स्टाफ सूची पर वापस जाएं",

      // Training Period
      trainingPeriod: "प्रशिक्षण अवधि",
      trainingPeriodFrom: "से",
      trainingPeriodTo: "तक",

      // Print and Export
      documentGenerated: "यह दस्तावेज़ इस तिथि पर उत्पन्न किया गया था",
      printingTrainees: "प्रशिक्षु(ओं) को प्रिंट किया जा रहा है",
      printingStaff: "स्टाफ सदस्य(ओं) को प्रिंट किया जा रहा है",
      traineeCSVDownloaded: "प्रशिक्षु(ओं) के साथ CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई",
      staffCSVDownloaded: "स्टाफ सदस्य(ओं) के साथ CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई",
      selectTraineesToPrint: "कृपया प्रिंट करने के लिए कम से कम एक प्रशिक्षु का चयन करें",
      selectTraineesToDownload: "कृपया डाउनलोड करने के लिए कम से कम एक प्रशिक्षु का चयन करें",
      failedToPrint: "प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।",
      csvDownloaded: "CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई",
      searchByName: "नाम से खोजें...",
      rtcPolice: "आरटीसी पुलिस लाइन, मुरादाबाद",
      traineeInfo: "आरटीसी प्रशिक्षु जानकारी",
      currentPosting: "वर्तमान पोस्टिंग",
      
      // Attendance and Leave Management
      markAttendance: "उपस्थिति दर्ज करें",
      markTraineeAttendance: "प्रशिक्षु उपस्थिति दर्ज करें",
      markStaffAttendance: "स्टाफ उपस्थिति दर्ज करें",
      attendanceManagement: "उपस्थिति प्रबंधन",
      traineeAttendance: "प्रशिक्षु उपस्थिति",
      staffAttendance: "स्टाफ उपस्थिति",
      date: "तारीख",
      status: "स्थिति",
      absent: "अनुपस्थित",
      onLeave: "अवकाश पर",
      present: "उपस्थित",
      
      // Leave Management
      leaveManagement: "अवकाश प्रबंधन",
      traineeLeave: "प्रशिक्षु अवकाश",
      staffLeave: "स्टाफ अवकाश",
      submitTraineeLeaveRequest: "प्रशिक्षु अवकाश अनुरोध जमा करें",
      submitStaffLeaveRequest: "स्टाफ अवकाश अनुरोध जमा करें",
      startDate: "प्रारंभ तिथि",
      endDate: "अंतिम तिथि",
      reasonForLeave: "अवकाश का कारण",
      submitLeaveRequest: "अवकाश अनुरोध जमा करें",
      enterReason: "अवकाश का कारण दर्ज करें"
    },
  },
};

// Initialize i18n with updated configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

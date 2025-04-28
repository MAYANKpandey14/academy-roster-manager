
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translation keys
interface TranslationKeys {
  welcome: string;
  loading: string;
  error: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  view: string;
  back: string;

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

  trainees: string;
  staff: string;
  attendance: string;
  leave: string;

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
  
  headerTitle: string;
  home: string;
  logoutSuccess: string;
  logoutError: string;

  // Added translation keys for trainee form
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
  
  // Added translation keys for actions
  processing: string;
  search: string;
  showAll: string;
  refresh: string;
  printAll: string;
  downloadAll: string;
  
  // Added translation keys for auth and reset password
  emailAddress: string;
  resetYourPassword: string;
  signInToAccount: string;

  // Added translations for trainee search
  searchTrainee: string;
  searchTrainees: string;
  searchStaff: string;
  pnoNumber: string;
  chestNumber: string;
  rollNo: string;
  uniqueId: string;
  addNewTrainee: string;
  showAllTrainees: string;
  searchTraineeBtn: string;

  // Added translations for table elements
  rowsPerPage: string;
  totalTrainees: string;
  totalStaff: string;
  page: string;
  of: string;
  noResults: string;
  rowsSelected: string;

  // Added translations for trainee table columns
  district: string;
  arrivalDate: string;
  departureDate: string;
  mobile: string;
  actions: string;

  // Added translations for staff table columns
  rank: string;
  postingDistrict: string;

  // Added translations for attendance and leave
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

  // Added translations for leave management
  leaveManagement: string;
  traineeLeave: string;
  staffLeave: string;
  submitTraineeLeaveRequest: string;
  submitStaffLeaveRequest: string;
  startDate: string;
  endDate: string;
  reasonForLeave: string;
  submitLeaveRequest: string;
  enterPNO: string;
  enterReason: string;

  // Added translations for printing and download options
  print: string;
  download: string;
  printSelected: string;
  downloadCSV: string;
}

interface Resources {
  [lang: string]: {
    translation: Partial<TranslationKeys>;
  };
}

const resources: Resources = {
  en: {
    translation: {
      welcome: "Welcome to RTC Police Line Management System",
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      back: "Back",

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

      trainees: "Trainees",
      staff: "Staff",
      attendance: "Attendance",
      leave: "Leave",

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

      headerTitle: "RTC TRAINING CENTRE POLICE LINE, MORADABAD",
      home: "Home",
      logoutSuccess: "Logged out successfully",
      logoutError: "Error logging out",
      
      // Added translations for trainee form
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
      
      // Added translations for actions
      processing: "Processing...",
      search: "Search",
      showAll: "Show All",
      refresh: "Refresh",
      printAll: "Print All",
      downloadAll: "Download All",
      
      // Added translations for auth and reset password
      emailAddress: "Email address",
      resetYourPassword: "Reset your password",
      signInToAccount: "Sign in to your account",

      // Added translations for trainee search
      searchTrainee: "Search Trainee",
      searchTrainees: "Search Trainees",
      searchStaff: "Search Staff",
      pnoNumber: "PNO Number",
      chestNumber: "Chest Number",
      rollNo: "Roll No",
      uniqueId: "/ Unique Id",
      addNewTrainee: "Add Trainee",
      showAllTrainees: "Show All Trainees", 
      searchTraineeBtn: "Search Trainee",

      // Added translations for table elements
      rowsPerPage: "Rows per page",
      totalTrainees: "trainee(s) total",
      totalStaff: "staff member(s) total",
      page: "Page",
      of: "of",
      noResults: "No results found.",
      rowsSelected: "row(s) selected",

      // Added translations for trainee table columns
      district: "District",
      arrivalDate: "Arrival Date",
      departureDate: "Departure Date",
      mobile: "Mobile",
      actions: "Actions",

      // Added translations for staff table columns
      rank: "Rank",
      postingDistrict: "Posting District",

      // Added translations for attendance and leave
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

      // Added translations for leave management
      leaveManagement: "Leave Management",
      traineeLeave: "Trainee Leave",
      staffLeave: "Staff Leave", 
      submitTraineeLeaveRequest: "Submit Trainee Leave Request",
      submitStaffLeaveRequest: "Submit Staff Leave Request",
      startDate: "Start Date",
      endDate: "End Date",
      reasonForLeave: "Reason For Leave",
      submitLeaveRequest: "Submit Leave Request",
      enterPNO: "Enter PNO",
      enterReason: "Enter reason for leave",

      // Added translations for printing and download options
      print: "Print",
      download: "Download",
      printSelected: "Print Selected",
      downloadCSV: "Download CSV"
    },
  },
  hi: {
    translation: {
      welcome: "आरटीसी पुलिस लाइन प्रबंधन प्रणाली में आपका स्वागत है",
      loading: "लोड हो रहा है...",
      error: "एक त्रुटि हुई",
      save: "सहेजें",
      cancel: "रद्द करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      view: "देखें",
      back: "वापस",

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

      trainees: "प्रशिक्षु",
      staff: "स्टाफ",
      attendance: "उपस्थिति",
      leave: "अवकाश",

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

      headerTitle: "आरटीसी ट्रेनिंग सेंटर पुलिस लाइन, मुरादाबाद",
      home: "होम",
      logoutSuccess: "सफलतापूर्वक लॉगआउट किया गया",
      logoutError: "लॉगआउट करने में त्रुटि",
      
      // Added translations for trainee form
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
      
      // Added translations for actions
      processing: "प्रोसेसिंग...",
      search: "खोज",
      showAll: "सभी दिखाएं",
      refresh: "रिफ्रेश",
      printAll: "सभी प्रिंट करें",
      downloadAll: "सभी डाउनलोड करें",
      
      // Added translations for auth and reset password
      emailAddress: "ईमेल पता",
      resetYourPassword: "अपना पासवर्ड रीसेट करें",
      signInToAccount: "अपने खाते में साइन इन करें",
      
      // Added translations for trainee search
      searchTrainee: "प्रशिक्षु खोजें",
      searchTrainees: "प्रशिक्षुओं को खोजें",
      searchStaff: "स्टाफ खोजें",
      pnoNumber: "पीएनओ नंबर",
      chestNumber: "छाती संख्या",
      rollNo: "रोल नंबर",
      uniqueId: "/ विशिष्ट आईडी",
      addNewTrainee: "प्रशिक्षु जोड़ें",
      showAllTrainees: "सभी प्रशिक्षु दिखाएं",
      searchTraineeBtn: "प्रशिक्षु खोजें",
      
      // Added translations for table elements
      rowsPerPage: "प्रति पेज पंक्तियां",
      totalTrainees: "कुल प्रशिक्षु",
      totalStaff: "कुल स्टाफ सदस्य",
      page: "पेज",
      of: "का",
      noResults: "कोई परिणाम नहीं मिला।",
      rowsSelected: "पंक्तियां चयनित",
      
      // Added translations for trainee table columns
      district: "जिला",
      arrivalDate: "आगमन तिथि",
      departureDate: "प्रस्थान तिथि",
      mobile: "मोबाइल",
      actions: "कार्रवाई",
      
      // Added translations for staff table columns
      rank: "रैंक",
      postingDistrict: "पोस्टिंग जिला",
      
      // Added translations for attendance and leave
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
      
      // Added translations for leave management
      leaveManagement: "अवकाश प्रबंधन",
      traineeLeave: "प्रशिक्षु अवकाश",
      staffLeave: "स्टाफ अवकाश",
      submitTraineeLeaveRequest: "प्रशिक्षु अवकाश अनुरोध जमा करें",
      submitStaffLeaveRequest: "स्टाफ अवकाश अनुरोध जमा करें",
      startDate: "प्रारंभ तिथि",
      endDate: "अंतिम तिथि",
      reasonForLeave: "अवकाश का कारण",
      submitLeaveRequest: "अवकाश अनुरोध जमा करें",
      enterPNO: "पीएनओ दर्ज करें",
      enterReason: "अवकाश का कारण दर्ज करें",
      
      // Added translations for printing and download options
      print: "प्रिंट",
      download: "डाउनलोड",
      printSelected: "चयनित प्रिंट करें",
      downloadCSV: "CSV डाउनलोड करें"
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

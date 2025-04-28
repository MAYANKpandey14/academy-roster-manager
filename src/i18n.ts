
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
      signInToAccount: "Sign in to your account"
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
      signInToAccount: "अपने खाते में साइन इन करें"
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

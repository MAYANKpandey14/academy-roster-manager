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
}

interface Resources {
  [lang: string]: {
    translation: Partial<TranslationKeys>;
  };
}

// Translation resources directly in-memory
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
    },
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, // Set to false for production

    interpolation: {
      escapeValue: false, // React already escapes by default
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

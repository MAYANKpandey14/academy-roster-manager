
import { TranslationKeys } from './types';

/**
 * Hindi translations for the application
 */
export const hiTranslations: Partial<TranslationKeys> = {
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
  rollNo: "रोल नंबर", // Without the slash
  uniqueId: "विशिष्ट आईडी", // This will be combined with the slash separately in UI components
  addNewTrainee: "प्रशिक्षु जोड़ें",
  showAllTrainees: "सभी प्रशिक्षु दिखाएं",
  showAllStaff: "सभी स्टाफ दिखाएं",
  searchTraineeBtn: "प्रशिक्षु खोजें",
  enterPNO: "पीएनओ दर्ज करें (9-अंक)",
  enterChestNo: "छाती संख्या दर्ज करें (4-अंक)",
  enterRollNo: "रोल नंबर / विशिष्ट आईडी दर्ज करें (12-अंक)", // Preserve "/" as literal character
  
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
};

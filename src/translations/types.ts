
/**
 * Define translation keys for the application
 */
export interface TranslationKeys {
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

  // Attendance and Leave Management
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

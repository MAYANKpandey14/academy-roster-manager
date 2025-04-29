
import { TranslationKeys } from './types';

/**
 * English translations for the application
 */
export const enTranslations: Partial<TranslationKeys> = {
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
  rollNo: "Roll No", // Without the slash
  uniqueId: "/ Unique Id", // This will be combined with the slash separately in UI components
  addNewTrainee: "Add Trainee",
  showAllTrainees: "Show All Trainees", 
  showAllStaff: "Show All Staff",
  searchTraineeBtn: "Search Trainee",
  enterPNO: "Enter PNO (9-digit)",
  enterChestNo: "Enter Chest No (4-digit)",
  enterRollNo: "Enter Roll No / Unique ID (12-digit)", // Preserve "/" as literal character

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
};

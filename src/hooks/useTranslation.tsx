
// This is a simplified version that only returns Hindi text
export function useTranslation() {
  // Return translation function that always returns Hindi
  const t = (key: string): string => {
    // This function now just returns the Hindi text based on the key
    // We're hard-coding Hindi text directly
    switch (key) {
      // Authentication
      case 'login': return 'लॉग इन';
      case 'logout': return 'लॉग आउट';
      case 'email': return 'ईमेल';
      case 'password': return 'पासवर्ड';
      case 'forgotPassword': return 'पासवर्ड भूल गए?';
      case 'resetPassword': return 'पासवर्ड रीसेट करें';
      case 'processing': return 'प्रोसेसिंग...';
      
      // Navigation
      case 'back': return 'वापस';
      case 'home': return 'होम';
      case 'logoutSuccess': return 'सफलतापूर्वक लॉग आउट कर दिया गया';
      
      // Trainee Management
      case 'trainees': return 'प्रशिक्षु';
      case 'addNewTrainee': return 'नया प्रशिक्षु जोड़ें';
      case 'traineeDetails': return 'प्रशिक्षु विवरण';
      case 'editTrainee': return 'प्रशिक्षु संपादित करें';
      case 'traineeAdded': return 'प्रशिक्षु सफलतापूर्वक जोड़ा गया';
      case 'viewTraineeDetails': return 'प्रशिक्षु विवरण देखें';
      case 'traineeNotFound': return 'प्रशिक्षु नहीं मिला या हटा दिया गया है';
      case 'returnToTraineeList': return 'प्रशिक्षु सूची पर वापस जाएं';
      case 'loadingTraineeDetails': return 'प्रशिक्षु डेटा लोड हो रहा है...';
      
      // Form fields
      case 'pno': return 'पीएनओ';
      case 'chestNo': return 'चेस्ट नंबर';
      case 'name': return 'नाम';
      case 'fatherName': return 'पिता का नाम';
      case 'dateOfArrival': return 'आगमन की तारीख';
      case 'dateOfDeparture': return 'प्रस्थान की तारीख';
      case 'currentPostingDistrict': return 'वर्तमान तैनाती जिला';
      case 'mobileNumber': return 'मोबाइल नंबर';
      case 'education': return 'शिक्षा';
      case 'dateOfBirth': return 'जन्म तिथि';
      case 'dateOfJoining': return 'नियुक्ति तिथि';
      case 'bloodGroup': return 'रक्त समूह';
      case 'nominee': return 'नामिती';
      case 'homeAddress': return 'घर का पता';
      
      // Staff Management
      case 'staff': return 'स्टाफ';
      case 'addStaff': return 'स्टाफ जोड़ें';
      case 'editStaff': return 'स्टाफ संपादित करें';
      case 'addNewStaff': return 'नया स्टाफ जोड़ें';
      case 'staffAddedSuccessfully': return 'स्टाफ सफलतापूर्वक जोड़ा गया';
      case 'staffUpdatedSuccessfully': return 'स्टाफ सफलतापूर्वक अपडेट किया गया';
      case 'viewStaffDetails': return 'स्टाफ विवरण देखें';
      case 'searchStaff': return 'स्टाफ खोजें';
      case 'staffNotFound': return 'स्टाफ नहीं मिला या हटा दिया गया है';
      case 'returnToStaffList': return 'स्टाफ सूची पर वापस जाएं';
      case 'loadingStaffDetails': return 'स्टाफ विवरण लोड हो रहा है...';
      
      // Common Form Fields
      case 'save': return 'सेव करें';
      case 'cancel': return 'रद्द करें';
      case 'saving': return 'सेव हो रहा है...';
      case 'loading': return 'लोड हो रहा है...';
      case 'search': return 'खोजें';
      case 'edit': return 'संपादित करें';
      case 'view': return 'देखें';
      case 'print': return 'प्रिंट';
      case 'download': return 'डाउनलोड';
      case 'downloadCSV': return 'CSV डाउनलोड';
      
      // Table Actions
      case 'selectTraineesToPrint': return 'प्रिंट के लिए कम से कम एक प्रशिक्षु का चयन करें';
      case 'printingTrainees': return 'प्रशिक्षु(ओं) का प्रिंट हो रहा है';
      case 'failedToPrint': return 'प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।';
      case 'selectTraineesToDownload': return 'डाउनलोड के लिए कम से कम एक प्रशिक्षु का चयन करें';
      case 'traineeCSVDownloaded': return 'प्रशिक्षुओं वाली CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई';
      case 'printSelected': return 'चयनित प्रिंट करें';
      case 'selected': return 'चयनित';
      case 'refresh': return 'रिफ्रेश';
      
      // Search and Filters
      case 'totalItems': return 'कुल आइटम';
      case 'totalTrainees': return 'कुल प्रशिक्षु';
      case 'totalStaff': return 'कुल स्टाफ';
      case 'of': return 'का';
      case 'page': return 'पेज';
      case 'rowsPerPage': return 'प्रति पेज पंक्तियां';
      case 'noResults': return 'कोई परिणाम नहीं मिला';
      
      // Attendance and Leave
      case 'attendanceManagement': return 'उपस्थिति प्रबंधन';
      case 'traineeAttendance': return 'प्रशिक्षु उपस्थिति';
      case 'staffAttendance': return 'स्टाफ उपस्थिति';
      case 'markTraineeAttendance': return 'प्रशिक्षु उपस्थिति चिह्नित करें';
      case 'markStaffAttendance': return 'स्टाफ उपस्थिति चिह्नित करें';
      case 'leaveManagement': return 'अवकाश प्रबंधन';
      case 'traineeLeave': return 'प्रशिक्षु अवकाश';
      case 'staffLeave': return 'स्टाफ अवकाश';
      
      // Welcome Page
      case 'welcomeText': return 'राजकीय प्रशिक्षण केंद्र प्रशिक्षु प्रबंधन प्रणाली में आपका स्वागत है';
      case 'openDashboard': return 'डैशबोर्ड खोलें';
      
      // Default case
      default: return key; // Return the key itself if no translation is found
    }
  };

  // Return translation function and language (always Hindi)
  return { 
    t, 
    i18n: { 
      language: 'hi'
    } 
  };
}

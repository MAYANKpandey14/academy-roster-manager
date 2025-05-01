import { format } from "date-fns";
import { StaffInfoField } from "./StaffInfoField";
import { useLanguage } from "@/contexts/LanguageContext";
import { Staff } from "@/types/staff";

interface StaffDetailsSectionProps {
  staff: Staff;
}

export function StaffDetailsSection({ staff }: StaffDetailsSectionProps) {
  const { isHindi } = useLanguage();

  return (
    <>
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "व्यक्तिगत जानकारी" : "Personal Information"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StaffInfoField label={isHindi ? "पीएनओ नंबर" : "PNO Number"} value={staff.pno} />
          <StaffInfoField label={isHindi ? "नाम" : "Name"} value={staff.name} isMultilingual={true} />
          <StaffInfoField label={isHindi ? "बाप का नाम" : "Father's Name"} value={staff.father_name} isMultilingual={true} />
          <StaffInfoField label={isHindi ? "रैंक" : "Rank"} value={staff.rank} />
          <StaffInfoField label={isHindi ? "मोबाइल नंबर" : "Mobile Number"} value={staff.mobile_number} />
          <StaffInfoField 
            label={isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"} 
            value={staff.current_posting_district} 
            isMultilingual={true} 
          />
          <StaffInfoField label={isHindi ? "शिक्षा" : "Education"} value={staff.education} isMultilingual={true} />
          <StaffInfoField label={isHindi ? "रक्त समूह" : "Blood Group"} value={staff.blood_group} />
          <StaffInfoField label={isHindi ? "नौमिनी" : "Nominee"} value={staff.nominee} isMultilingual={true} />
        </div>
      </div>

      <div>
        <h2 className={`text-xl font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "तिथियाँ" : "Dates"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StaffInfoField 
            label={isHindi ? "जन्म तिथि" : "Date of Birth"} 
            value={staff.date_of_birth ? format(new Date(staff.date_of_birth), "PPP") : "N/A"} 
          />
          <StaffInfoField 
            label={isHindi ? "शामिल होने की तिथि" : "Date of Joining"} 
            value={staff.date_of_joining ? format(new Date(staff.date_of_joining), "PPP") : "N/A"} 
          />
        </div>
      </div>

      <div>
        <h2 className={`text-xl font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "पता" : "Address"}
        </h2>
        <p className={isHindi ? 'font-hindi' : ''}>
          {staff.home_address}
        </p>
      </div>
      
      {(staff.toli_no || staff.class_no || staff.class_subject) && (
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "अतिरिक्त जानकारी" : "Additional Information"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.toli_no && (
              <StaffInfoField label={isHindi ? "टोली नंबर" : "Toli Number"} value={staff.toli_no} />
            )}
            {staff.class_no && (
              <StaffInfoField label={isHindi ? "क्लास नंबर" : "Class Number"} value={staff.class_no} />
            )}
            {staff.class_subject && (
              <StaffInfoField 
                label={isHindi ? "क्लास विषय" : "Class Subject"} 
                value={staff.class_subject} 
                isMultilingual={true} 
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

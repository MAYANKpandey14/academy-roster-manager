
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Staff } from "@/types/staff";
import { StaffInfoField } from "./StaffInfoField";
import { ImageLoader } from "@/components/common/ImageLoader";
import { AttendanceHistory } from "@/components/attendance/AttendanceHistory";

interface StaffDetailsSectionProps {
  staff: Staff;
}

export function StaffDetailsSection({ staff }: StaffDetailsSectionProps) {
  const { isHindi } = useLanguage();

  // Format dates for display
  const formattedDOB = staff.date_of_birth 
    ? format(new Date(staff.date_of_birth), "dd/MM/yyyy")
    : "";
    
  const formattedDOJ = staff.date_of_joining 
    ? format(new Date(staff.date_of_joining), "dd/MM/yyyy")
    : "";

  const formattedArrivalDateRTC = staff.arrival_date 
    ? format(new Date(staff.arrival_date), "dd/MM/yyyy")
    : "";

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo section */}
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
          {staff.photo_url ? (
            <ImageLoader
              src={staff.photo_url}
              alt={`${staff.name}'s photo`}
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg border shadow-sm mb-4"
              objectFit="cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-light mb-4">
              {staff.name.charAt(0)}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-medium">{staff.name}</h3>
            <p className="text-gray-600">{staff.rank || ""}</p>
          </div>
        </div>

        {/* Personal details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
            {isHindi ? "व्यक्तिगत विवरण" : "Personal Details"}
          </h3>
          
          <StaffInfoField 
            label={isHindi ? "पी.एन.ओ./ यूनिक आईडी" : "PNO/ Unique ID"} 
            value={staff.pno} 
          />
          
          <StaffInfoField 
            label={isHindi ? "पिता का नाम" : "Father's Name"} 
            value={staff.father_name} 
          />

          <StaffInfoField 
            label={isHindi ? "श्रेणी/जाति" : "Category/Caste"} 
            value={staff.category_caste} 
            isMultilingual={true}
          />
          
          <StaffInfoField 
            label={isHindi ? "शिक्षा" : "Education"} 
            value={staff.education} 
          />
          
          <StaffInfoField 
            label={isHindi ? "जन्म तिथि" : "Date of Birth"} 
            value={formattedDOB} 
          />
          
          <StaffInfoField 
            label={isHindi ? "रक्त समूह" : "Blood Group"} 
            value={staff.blood_group} 
          />
        </div>

        {/* Service details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
            {isHindi ? "सेवा विवरण" : "Service Details"}
          </h3>
          
          <StaffInfoField 
            label={isHindi ? "रैंक" : "Rank"} 
            value={staff.rank} 
          />
          
          <StaffInfoField 
            label={isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"} 
            value={staff.current_posting_district} 
          />
          
          <StaffInfoField 
            label={isHindi ? "भर्ती की तारीख" : "Date of Joining"} 
            value={formattedDOJ} 
          />
          
          <StaffInfoField 
            label={isHindi ? "आगमन की तारीख RTC" : "Arrival Date RTC"} 
            value={formattedArrivalDateRTC} 
          />
          
          {staff.toli_no && (
            <StaffInfoField 
              label={isHindi ? "टोली संख्या" : "Toli Number"} 
              value={staff.toli_no} 
            />
          )}
        </div>
      </div>

      {/* Contact details */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
          {isHindi ? "संपर्क विवरण" : "Contact Details"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StaffInfoField 
            label={isHindi ? "मोबाइल नंबर" : "Mobile Number"} 
            value={staff.mobile_number} 
          />
          
          <StaffInfoField 
            label={isHindi ? "घर का पता" : "Home Address"} 
            value={staff.home_address} 
          />
          
          <StaffInfoField 
            label={isHindi ? "नामित व्यक्ति" : "Nominee"} 
            value={staff.nominee} 
          />
        </div>
      </div>

      {/* Attendance and Leave History */}
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
          {isHindi ? "उपस्थिति और छुट्टी का इतिहास" : "Attendance & Leave History"}
        </h3>
        
        <AttendanceHistory 
          personId={staff.id} 
          personType="staff"
        />
      </div>
    </div>
  );
}

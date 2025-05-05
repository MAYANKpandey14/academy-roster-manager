
import { format } from "date-fns";
import { StaffInfoField } from "./StaffInfoField";
import { useLanguage } from "@/contexts/LanguageContext";
import { Staff } from "@/types/staff";
import { ImageLoader } from "@/components/common/ImageLoader";

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
            <p className="text-gray-600">{staff.rank}</p>
          </div>
        </div>

        {/* Personal details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
            {isHindi ? "व्यक्तिगत विवरण" : "Personal Details"}
          </h3>
          
          <StaffInfoField 
            label={isHindi ? "पी.एन.ओ." : "PNO"} 
            value={staff.pno} 
          />
          
          <StaffInfoField 
            label={isHindi ? "पिता का नाम" : "Father's Name"} 
            value={staff.father_name} 
            isMultilingual={true}
          />
          
          <StaffInfoField 
            label={isHindi ? "शिक्षा" : "Education"} 
            value={staff.education} 
            isMultilingual={true}
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
            label={isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"} 
            value={staff.current_posting_district} 
            isMultilingual={true}
          />
          
          <StaffInfoField 
            label={isHindi ? "भर्ती की तारीख" : "Date of Joining"} 
            value={formattedDOJ} 
          />
          
          {staff.toli_no && (
            <StaffInfoField 
              label={isHindi ? "टोली संख्या" : "Toli Number"} 
              value={staff.toli_no} 
            />
          )}
          
          {staff.class_no && (
            <StaffInfoField
              label={isHindi ? "क्लास नंबर" : "Class Number"} 
              value={staff.class_no}
            />
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
            isMultilingual={true}
          />
          
          <StaffInfoField 
            label={isHindi ? "नामित व्यक्ति" : "Nominee"} 
            value={staff.nominee} 
            isMultilingual={true}
          />
        </div>
      </div>
    </div>
  );
}

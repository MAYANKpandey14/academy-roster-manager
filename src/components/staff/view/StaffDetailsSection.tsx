
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Staff } from "@/types/staff";
import { StaffInfoField } from "./StaffInfoField";
import { prepareTextForLanguage } from "@/utils/textUtils";

interface StaffDetailsSectionProps {
  staff: Staff;
}

export function StaffDetailsSection({ staff }: StaffDetailsSectionProps) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-4">
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
            {t("personalInformation", "Personal Information")}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StaffInfoField label={t("pno", "PNO")} value={staff.pno} />
          <StaffInfoField label={t("name", "Name")} value={staff.name} isMultilingual={true} />
          <StaffInfoField label={t("fatherName", "Father's Name")} value={staff.father_name} isMultilingual={true} />
          <StaffInfoField label={t("rank", "Rank")} value={staff.rank} />
          <StaffInfoField label={t("mobileNumber", "Mobile Number")} value={staff.mobile_number} />
          <StaffInfoField 
            label={t("currentPostingDistrict", "Current Posting District")} 
            value={staff.current_posting_district} 
            isMultilingual={true} 
          />
          <StaffInfoField label={t("education", "Education")} value={staff.education} isMultilingual={true} />
          <StaffInfoField label={t("bloodGroup", "Blood Group")} value={staff.blood_group} />
          <StaffInfoField label={t("nominee", "Nominee")} value={staff.nominee} isMultilingual={true} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
            {t("dates", "Dates")}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StaffInfoField 
            label={t("dateOfBirth", "Date of Birth")} 
            value={staff.date_of_birth ? format(new Date(staff.date_of_birth), "PPP") : "N/A"} 
          />
          <StaffInfoField 
            label={t("dateOfJoining", "Date of Joining")} 
            value={staff.date_of_joining ? format(new Date(staff.date_of_joining), "PPP") : "N/A"} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
            {t("address", "Address")}
          </span>
        </h2>
        <p>
          <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`} lang={i18n.language}>
            {prepareTextForLanguage(staff.home_address, i18n.language)}
          </span>
        </p>
      </div>
      
      {(staff.toli_no || staff.class_no || staff.class_subject) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
              {t("additionalInformation", "Additional Information")}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.toli_no && (
              <StaffInfoField label={t("toliNumber", "Toli Number")} value={staff.toli_no} />
            )}
            {staff.class_no && (
              <StaffInfoField label={t("classNumber", "Class Number")} value={staff.class_no} />
            )}
            {staff.class_subject && (
              <StaffInfoField 
                label={t("classSubject", "Class Subject")} 
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

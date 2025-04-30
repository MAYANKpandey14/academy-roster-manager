
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { TraineeInfoField } from "./TraineeInfoField";
import { useTranslation } from "react-i18next";

interface TraineeDetailsSectionProps {
  trainee: Trainee;
}

export function TraineeDetailsSection({ trainee }: TraineeDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <TraineeInfoField 
          label={t("pno", "PNO")} 
          value={trainee.pno} 
        />
        <TraineeInfoField 
          label={t("chestNo", "Chest No")} 
          value={trainee.chest_no} 
        />
        <TraineeInfoField 
          label={t("name", "Name")} 
          value={trainee.name}
          isMultilingual
        />
        <TraineeInfoField 
          label={t("fatherName", "Father's Name")} 
          value={trainee.father_name}
          isMultilingual
        />
        <TraineeInfoField 
          label={t("currentPostingDistrict", "Current Posting District")} 
          value={trainee.current_posting_district}
          isMultilingual
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={t("mobileNumber", "Mobile Number")} 
          value={trainee.mobile_number} 
        />
        <TraineeInfoField 
          label={t("education", "Education")} 
          value={trainee.education}
          isMultilingual
        />
        <TraineeInfoField 
          label={t("bloodGroup", "Blood Group")} 
          value={trainee.blood_group} 
        />
        <TraineeInfoField 
          label={t("nominee", "Nominee")} 
          value={trainee.nominee}
          isMultilingual
        />
        <TraineeInfoField 
          label={t("homeAddress", "Home Address")} 
          value={trainee.home_address}
          isMultilingual
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={t("dateOfBirth", "Date of Birth")} 
          value={format(new Date(trainee.date_of_birth), 'PP')} 
        />
        <TraineeInfoField 
          label={t("dateOfJoining", "Date of Joining")} 
          value={format(new Date(trainee.date_of_joining), 'PP')} 
        />
        <TraineeInfoField 
          label={t("trainingPeriod", "Training Period")} 
          value={`${format(new Date(trainee.arrival_date), 'PP')} - ${format(new Date(trainee.departure_date), 'PP')}`} 
        />
      </div>
    </div>
  );
}

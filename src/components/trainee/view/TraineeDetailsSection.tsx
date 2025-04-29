
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { TraineeInfoField } from "./TraineeInfoField";
import { useTranslation } from "@/hooks/useTranslation";

interface TraineeDetailsSectionProps {
  trainee: Trainee;
}

export function TraineeDetailsSection({ trainee }: TraineeDetailsSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <TraineeInfoField 
          label={t("pno", "पीएनओ")} 
          value={trainee.pno} 
        />
        <TraineeInfoField 
          label={t("chestNo", "चेस्ट नंबर")} 
          value={trainee.chest_no} 
        />
        <TraineeInfoField 
          label={t("name", "नाम")} 
          value={trainee.name}
        />
        <TraineeInfoField 
          label={t("fatherName", "पिता का नाम")} 
          value={trainee.father_name}
        />
        <TraineeInfoField 
          label={t("currentPostingDistrict", "वर्तमान तैनाती जिला")} 
          value={trainee.current_posting_district}
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={t("mobileNumber", "मोबाइल नंबर")} 
          value={trainee.mobile_number} 
        />
        <TraineeInfoField 
          label={t("education", "शिक्षा")} 
          value={trainee.education}
        />
        <TraineeInfoField 
          label={t("bloodGroup", "रक्त समूह")} 
          value={trainee.blood_group} 
        />
        <TraineeInfoField 
          label={t("nominee", "नामिती")} 
          value={trainee.nominee}
        />
        <TraineeInfoField 
          label={t("homeAddress", "घर का पता")} 
          value={trainee.home_address}
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={t("dateOfBirth", "जन्म तिथि")} 
          value={format(new Date(trainee.date_of_birth), 'PP')} 
        />
        <TraineeInfoField 
          label={t("dateOfJoining", "नियुक्ति तिथि")} 
          value={format(new Date(trainee.date_of_joining), 'PP')} 
        />
        <TraineeInfoField 
          label={t("trainingPeriod", "प्रशिक्षण अवधि")} 
          value={`${format(new Date(trainee.arrival_date), 'PP')} - ${format(new Date(trainee.departure_date), 'PP')}`} 
        />
      </div>
    </div>
  );
}

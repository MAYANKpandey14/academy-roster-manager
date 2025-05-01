
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { TraineeInfoField } from "./TraineeInfoField";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeDetailsSectionProps {
  trainee: Trainee;
}

export function TraineeDetailsSection({ trainee }: TraineeDetailsSectionProps) {
    const { isHindi } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <TraineeInfoField 
          label={isHindi ? "पीएनओ नंबर" : "PNO Number"} 
          value={trainee.pno} 
        />
        <TraineeInfoField 
          label={isHindi ? "चेस्ट नंबर" : "Chest No"} 
          value={trainee.chest_no} 
        />
        <TraineeInfoField 
          label={isHindi ? "नाम" : "Name"} 
          value={trainee.name}
          isMultilingual
        />
        <TraineeInfoField 
          label={isHindi ? "पिता का नाम" : "Father's Name"} 
          value={trainee.father_name}
          isMultilingual
        />
        <TraineeInfoField 
          label={isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"} 
          value={trainee.current_posting_district}
          isMultilingual
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={isHindi ? "मोबाइल नंबर" : "Mobile Number"} 
          value={trainee.mobile_number} 
        />
        <TraineeInfoField 
          label={isHindi ? "शिक्षा" : "Education"} 
          value={trainee.education}
          isMultilingual
        />
        <TraineeInfoField 
          label={isHindi ? "रक्त समूह" : "Blood Group"} 
          value={trainee.blood_group} 
        />
        <TraineeInfoField 
          label={isHindi ? "नौमिनी" : "Nominee"} 
          value={trainee.nominee}
          isMultilingual
        />
        <TraineeInfoField 
          label={isHindi ? "घर का पता" : "Home Address"} 
          value={trainee.home_address}
          isMultilingual
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label={isHindi ? "जन्म तिथि" : "Date of Birth"} 
          value={format(new Date(trainee.date_of_birth), 'PP')} 
        />
        <TraineeInfoField 
          label={isHindi ? "शामिल होने की तारीख" : "Date of Joining"} 
          value={format(new Date(trainee.date_of_joining), 'PP')} 
        />
        <TraineeInfoField 
          label={isHindi ? "प्रशिक्षण अवधि" : "Training Period"} 
          value={`${format(new Date(trainee.arrival_date), 'PP')} - ${format(new Date(trainee.departure_date), 'PP')}`} 
        />
      </div>
    </div>
  );
}

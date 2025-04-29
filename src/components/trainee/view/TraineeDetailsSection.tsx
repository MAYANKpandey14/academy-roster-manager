
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { TraineeInfoField } from "./TraineeInfoField";

interface TraineeDetailsSectionProps {
  trainee: Trainee;
}

export function TraineeDetailsSection({ trainee }: TraineeDetailsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      <div className="space-y-4">
        <TraineeInfoField 
          label="पीएनओ" 
          value={trainee.pno} 
        />
        <TraineeInfoField 
          label="चेस्ट नंबर" 
          value={trainee.chest_no} 
        />
        <TraineeInfoField 
          label="नाम" 
          value={trainee.name}
          isDbValue={true}
        />
        <TraineeInfoField 
          label="पिता का नाम" 
          value={trainee.father_name}
          isDbValue={true}
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label="वर्तमान तैनाती जिला" 
          value={trainee.current_posting_district}
          isDbValue={true}
        />
        <TraineeInfoField 
          label="मोबाइल नंबर" 
          value={trainee.mobile_number} 
        />
        <TraineeInfoField 
          label="शिक्षा" 
          value={trainee.education}
          isDbValue={true}
        />
        <TraineeInfoField 
          label="रक्त समूह" 
          value={trainee.blood_group} 
        />
      </div>

      <div className="space-y-4">
        <TraineeInfoField 
          label="नामिती" 
          value={trainee.nominee}
          isDbValue={true}
        />
        <TraineeInfoField 
          label="घर का पता" 
          value={trainee.home_address}
          isDbValue={true}
        />
        <TraineeInfoField 
          label="जन्म तिथि" 
          value={format(new Date(trainee.date_of_birth), 'PP')} 
        />
        <TraineeInfoField 
          label="नियुक्ति तिथि" 
          value={format(new Date(trainee.date_of_joining), 'PP')} 
        />
        <TraineeInfoField 
          label="प्रशिक्षण अवधि" 
          value={`${format(new Date(trainee.arrival_date), 'PP')} - ${format(new Date(trainee.departure_date), 'PP')}`} 
        />
      </div>
    </div>
  );
}

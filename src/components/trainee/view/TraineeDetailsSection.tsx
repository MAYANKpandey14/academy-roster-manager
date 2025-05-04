
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";
import { TraineeInfoField } from "./TraineeInfoField";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageLoader } from "@/components/common/ImageLoader";

interface TraineeDetailsSectionProps {
  trainee: Trainee;
}

export function TraineeDetailsSection({ trainee }: TraineeDetailsSectionProps) {
  const { isHindi } = useLanguage();
  
  // Format dates for display
  const formattedDOB = trainee.date_of_birth 
    ? format(new Date(trainee.date_of_birth), "dd/MM/yyyy")
    : "";
    
  const formattedDOJ = trainee.date_of_joining 
    ? format(new Date(trainee.date_of_joining), "dd/MM/yyyy")
    : "";
    
  const formattedArrival = trainee.arrival_date 
    ? format(new Date(trainee.arrival_date), "dd/MM/yyyy")
    : "";
    
  const formattedDeparture = trainee.departure_date 
    ? format(new Date(trainee.departure_date), "dd/MM/yyyy")
    : "";

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo section */}
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
          {trainee.photo_url ? (
            <ImageLoader
              src={trainee.photo_url}
              alt={`${trainee.name}'s photo`}
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg border shadow-sm mb-4"
              objectFit="cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-light mb-4">
              {trainee.name.charAt(0)}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-medium">{trainee.name}</h3>
            <p className="text-gray-600">{trainee.rank || "CONST"}</p>
          </div>
        </div>

        {/* Personal details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
            {isHindi ? "व्यक्तिगत विवरण" : "Personal Details"}
          </h3>
          
          <TraineeInfoField 
            label={isHindi ? "पी.एन.ओ." : "PNO"} 
            value={trainee.pno} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "चेस्ट नंबर" : "Chest Number"} 
            value={trainee.chest_no} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "पिता का नाम" : "Father's Name"} 
            value={trainee.father_name} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "शिक्षा" : "Education"} 
            value={trainee.education} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "जन्म तिथि" : "Date of Birth"} 
            value={formattedDOB} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "रक्त समूह" : "Blood Group"} 
            value={trainee.blood_group} 
          />
        </div>

        {/* Service details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 dynamic-text">
            {isHindi ? "सेवा विवरण" : "Service Details"}
          </h3>
          
          <TraineeInfoField 
            label={isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"} 
            value={trainee.current_posting_district} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "भर्ती की तारीख" : "Date of Joining"} 
            value={formattedDOJ} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "प्रशिक्षण आगमन तिथि" : "Training Arrival Date"} 
            value={formattedArrival} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "प्रशिक्षण समाप्ति तिथि" : "Training Departure Date"} 
            value={formattedDeparture} 
          />
          
          {trainee.toli_no && (
            <TraineeInfoField 
              label={isHindi ? "टोली संख्या" : "Toli Number"} 
              value={trainee.toli_no} 
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
          <TraineeInfoField 
            label={isHindi ? "मोबाइल नंबर" : "Mobile Number"} 
            value={trainee.mobile_number} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "घर का पता" : "Home Address"} 
            value={trainee.home_address} 
          />
          
          <TraineeInfoField 
            label={isHindi ? "नामित व्यक्ति" : "Nominee"} 
            value={trainee.nominee} 
          />
        </div>
      </div>
    </div>
  );
}

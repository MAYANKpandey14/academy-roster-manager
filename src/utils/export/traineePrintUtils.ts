
import { Trainee } from "@/types/trainee";
import { format } from "date-fns";

/**
 * Creates HTML content for printing trainee(s)
 * 
 * @param trainees Trainee data (single trainee or array of trainees)
 * @returns HTML string content for printing
 */
export const createPrintContent = (trainees: Trainee | Trainee[]): string => {
  // Convert single trainee to array if needed
  const traineeArray = Array.isArray(trainees) ? trainees : [trainees];
  
  if (traineeArray.length === 0) {
    return "<h1>No trainee data available</h1>";
  }
  
  // Create the HTML content
  const htmlContent = `
    <div style="font-family: 'Kruti Dev 010', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 20px;">RTC POLICE LINE, MORADABAD</h1>
      ${traineeArray.map(trainee => createTraineeCard(trainee)).join('<div style="page-break-after: always;"></div>')}
    </div>
  `;
  
  return htmlContent;
};

/**
 * Creates HTML content for a single trainee
 * 
 * @param trainee Trainee data
 * @returns HTML string for printing
 */
const createTraineeCard = (trainee: Trainee): string => {
  return `
    <div style="border: 1px solid #ccc; padding: 20px; margin-bottom: 30px; border-radius: 5px;">
      <h2 style="text-align: center; margin-bottom: 20px;">${trainee.name} का विवरण</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div style="margin-bottom: 10px;">
          <strong>पी.एन.ओ.:</strong> ${trainee.pno}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>चेस्ट नंबर:</strong> ${trainee.chest_no}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>नाम:</strong> ${trainee.name}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>पिता का नाम:</strong> ${trainee.father_name}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>जन्म तिथि:</strong> ${format(new Date(trainee.date_of_birth), 'PP')}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>नियुक्ति तिथि:</strong> ${format(new Date(trainee.date_of_joining), 'PP')}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>वर्तमान तैनाती जिला:</strong> ${trainee.current_posting_district}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>मोबाइल नंबर:</strong> ${trainee.mobile_number}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>शिक्षा:</strong> ${trainee.education}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>रक्त समूह:</strong> ${trainee.blood_group}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>नामिती:</strong> ${trainee.nominee}
        </div>
      </div>
      
      <div style="margin-top: 15px;">
        <strong>घर का पता:</strong> ${trainee.home_address}
      </div>
      
      <div style="margin-top: 15px;">
        <strong>प्रशिक्षण अवधि:</strong> ${format(new Date(trainee.arrival_date), 'PP')} से ${format(new Date(trainee.departure_date), 'PP')} तक
      </div>
    </div>
  `;
};

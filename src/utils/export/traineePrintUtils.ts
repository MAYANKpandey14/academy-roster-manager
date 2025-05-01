import { Trainee } from '@/types/trainee';
import { format } from 'date-fns';
import { ensureUtf8Encoding } from '../textUtils';

// Styles for printing
const printStyles = `
  @media print {
    body {
      font-family: 'Space Grotesk', Arial, sans-serif;
    }
    .hindi-font {
      font-family: 'Mangal', 'Arial Unicode MS', sans-serif;
    }
    .trainee-print {
      width: 100%;
      margin: 0;
      padding: 0;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .info-section {
      margin-bottom: 15px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      margin-right: 5px;
    }
    .info-value {
      word-wrap: break-word;
    }
  }
`;

export const addPrintStyles = (): void => {
  const style = document.createElement('style');
  style.innerHTML = printStyles;
  document.head.appendChild(style);
};

export const generateTraineePrintHtml = (trainee: Trainee, language: 'en' | 'hi'): string => {
  const isHindi = language === 'hi';
  
  const translateLabel = (en: string, hi: string): string => {
    return isHindi ? hi : en;
  };

  // Function to prepare text for display
  const prepareText = (text: string | null | undefined): string => {
    if (!text) return '';
    return ensureUtf8Encoding(text);
  };

  // Define labels with translations
  const labels = {
    title: translateLabel('Trainee Information', 'प्रशिक्षु जानकारी'),
    pno: translateLabel('PNO Number', 'पीएनओ नंबर'),
    chestNo: translateLabel('Chest No', 'छाती नंबर'),
    name: translateLabel('Name', 'नाम'),
    fatherName: translateLabel('Father\'s Name', 'पिता का नाम'),
    rank: translateLabel('Rank', 'रैंक'),
    toliNo: translateLabel('Toli No', 'टोली नंबर'),
    district: translateLabel('Current Posting District', 'वर्तमान तैनाती जिला'),
    mobile: translateLabel('Mobile Number', 'मोबाइल नंबर'),
    education: translateLabel('Education', 'शिक्षा'),
    bloodGroup: translateLabel('Blood Group', 'रक्त समूह'),
    nominee: translateLabel('Nominee', 'नामांकित व्यक्ति'),
    address: translateLabel('Home Address', 'घर का पता'),
    dob: translateLabel('Date of Birth', 'जन्म तिथि'),
    doj: translateLabel('Date of Joining', 'नियुक्ति तिथि'),
    training: translateLabel('Training Period', 'प्रशिक्षण अवधि'),
    arrival: translateLabel('Date of Arrival', 'आगमन तिथि'),
    departure: translateLabel('Date of Departure', 'प्रस्थान तिथि'),
  };

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  return `
    <div class="trainee-print">
      <h2 class="${isHindi ? 'hindi-font' : ''}">${labels.title}</h2>
      
      <div class="info-grid">
        <div class="info-section">
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.pno}:</span>
            <span class="info-value">${trainee.pno}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.chestNo}:</span>
            <span class="info-value">${trainee.chest_no}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.name}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.name)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.fatherName}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.father_name)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.rank}:</span>
            <span class="info-value">${trainee.rank}</span>
          </div>
          ${trainee.toli_no ? `
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.toliNo}:</span>
            <span class="info-value">${trainee.toli_no.toString()}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.district}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.current_posting_district)}</span>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.mobile}:</span>
            <span class="info-value">${trainee.mobile_number}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.education}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.education)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.bloodGroup}:</span>
            <span class="info-value">${trainee.blood_group}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.nominee}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.nominee)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.address}:</span>
            <span class="info-value ${isHindi ? 'hindi-font' : ''}">${prepareText(trainee.home_address)}</span>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.dob}:</span>
            <span class="info-value">${formatDate(trainee.date_of_birth)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.doj}:</span>
            <span class="info-value">${formatDate(trainee.date_of_joining)}</span>
          </div>
          <div class="info-row">
            <span class="info-label ${isHindi ? 'hindi-font' : ''}">${labels.training}:</span>
            <span class="info-value">${formatDate(trainee.arrival_date)} - ${formatDate(trainee.departure_date)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};


import { Trainee } from '@/types/trainee';
import { formatDate } from '@/utils/textUtils';

/**
 * Creates HTML content for trainee printing
 */
export const createPrintContent = (trainee: Trainee) => {
  return `
    <div class="print-container krutidev-font">
      <div class="print-header">
        <h1>आरटीसी प्रशिक्षु विवरण</h1>
      </div>
      <div class="print-body">
        <div class="print-section">
          <h2>व्यक्तिगत जानकारी</h2>
          <div class="print-grid">
            <div class="print-field">
              <label>पी.एन.ओ.:</label>
              <span>${trainee.pno || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>छाती संख्या:</label>
              <span>${trainee.chest_no || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>नाम:</label>
              <span>${trainee.name || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>पिता का नाम:</label>
              <span>${trainee.father_name || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>जन्म तिथि:</label>
              <span>${trainee.date_of_birth ? formatDate(trainee.date_of_birth) : 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>शिक्षा:</label>
              <span>${trainee.education || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>रक्त समूह:</label>
              <span>${trainee.blood_group || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="print-section">
          <h2>सेवा जानकारी</h2>
          <div class="print-grid">
            <div class="print-field">
              <label>नियुक्ति तिथि:</label>
              <span>${trainee.date_of_joining ? formatDate(trainee.date_of_joining) : 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>वर्तमान तैनाती जिला:</label>
              <span>${trainee.current_posting_district || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>प्रशिक्षण आगमन तिथि:</label>
              <span>${trainee.arrival_date ? formatDate(trainee.arrival_date) : 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>प्रशिक्षण समाप्ति तिथि:</label>
              <span>${trainee.departure_date ? formatDate(trainee.departure_date) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="print-section">
          <h2>संपर्क जानकारी</h2>
          <div class="print-grid">
            <div class="print-field">
              <label>मोबाइल नंबर:</label>
              <span>${trainee.mobile_number || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>घर का पता:</label>
              <span>${trainee.home_address || 'N/A'}</span>
            </div>
            <div class="print-field">
              <label>नामांकित व्यक्ति:</label>
              <span>${trainee.nominee || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

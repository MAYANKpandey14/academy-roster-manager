
import { ArchivedStaff } from "@/types/archive";
import { Staff } from "@/types/staff";
import { getPrintStyles, createPrintHeader, createPrintFooter } from "./printUtils";
import { prepareTextForLanguage } from "../textUtils";

export async function createStaffPrintContent(
  staffList: (Staff | ArchivedStaff)[],
  isHindi: boolean = false
): Promise<string> {
  const title = isHindi ? "स्टाफ रिकॉर्ड" : "Staff Records";
  
  const styles = getPrintStyles(isHindi);
  const header = createPrintHeader(title, isHindi);
  const footer = createPrintFooter(isHindi);

  const recordsHtml = staffList.map(staff => `
    <div style="margin-bottom: 2em; padding: 1em; border: 1px solid #ddd; border-radius: 8px;">
      <div style="display: flex; align-items: center; margin-bottom: 1em;">
        ${staff.photo_url ? `<img src="${staff.photo_url}" alt="${staff.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 1em; object-fit: cover;" />` : ''}
        <div>
          <h3 style="margin: 0; font-size: 1.2em;">${prepareTextForLanguage(staff.name, isHindi)}</h3>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "पीएनओ" : "PNO"}: ${staff.pno}</p>
          <p style="margin: 0.2em 0; color: #666;">${isHindi ? "रैंक" : "Rank"}: ${staff.rank}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1em;">
        <div>
          <p><strong>${isHindi ? "पिता का नाम" : "Father's Name"}:</strong> ${prepareTextForLanguage(staff.father_name, isHindi)}</p>
          <p><strong>${isHindi ? "मोबाइल नंबर" : "Mobile Number"}:</strong> ${staff.mobile_number}</p>
          <p><strong>${isHindi ? "शिक्षा" : "Education"}:</strong> ${prepareTextForLanguage(staff.education, isHindi)}</p>
          <p><strong>${isHindi ? "जन्म तिथि" : "Date of Birth"}:</strong> ${new Date(staff.date_of_birth).toLocaleDateString()}</p>
          <p><strong>${isHindi ? "ज्वाइनिंग तिथि" : "Date of Joining"}:</strong> ${new Date(staff.date_of_joining).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>${isHindi ? "ब्लड ग्रुप" : "Blood Group"}:</strong> ${staff.blood_group}</p>
          <p><strong>${isHindi ? "नॉमिनी" : "Nominee"}:</strong> ${prepareTextForLanguage(staff.nominee, isHindi)}</p>
          <p><strong>${isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}:</strong> ${prepareTextForLanguage(staff.current_posting_district, isHindi)}</p>
          <p><strong>${isHindi ? "घर का पता" : "Home Address"}:</strong> ${prepareTextForLanguage(staff.home_address, isHindi)}</p>
          ${staff.toli_no ? `<p><strong>${isHindi ? "टोली नंबर" : "Toli No"}:</strong> ${staff.toli_no}</p>` : ''}
        </div>
      </div>
      
      ${'archived_at' in staff ? `
        <div style="margin-top: 1em; padding: 0.5em; background-color: #f0f9ff; border-radius: 4px;">
          <p style="margin: 0; font-size: 0.9em; color: #0369a1;">
            <strong>${isHindi ? "आर्काइव तिथि" : "Archived Date"}:</strong> ${new Date(staff.archived_at).toLocaleDateString()}
          </p>
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>${styles}</style>
    </head>
    <body>
      ${header}
      <div class="content">
        ${recordsHtml}
      </div>
      ${footer}
    </body>
    </html>
  `;
}

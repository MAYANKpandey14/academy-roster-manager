
import { Trainee } from "@/types/trainee";
import { formatDate } from "@/utils/textUtils";

/**
 * Creates CSV content from trainee data
 * @param trainees Trainee data to convert to CSV
 * @returns CSV content as string
 */
export function createCSVContent(trainees: Trainee[]): string {
  // Define headers
  const headers = [
    "पीएनओ",
    "चेस्ट नंबर",
    "नाम",
    "पिता का नाम",
    "आगमन की तिथि",
    "प्रस्थान की तिथि",
    "वर्तमान तैनाती जिला",
    "मोबाइल नंबर",
    "शिक्षा",
    "जन्म तिथि",
    "नियुक्ति तिथि",
    "रक्त समूह",
    "नामिती",
    "घर का पता"
  ];

  // Create CSV rows
  const rows = trainees.map(trainee => [
    trainee.pno || "",
    trainee.chest_no || "",
    trainee.name || "",
    trainee.father_name || "",
    formatDate(trainee.arrival_date),
    formatDate(trainee.departure_date),
    trainee.current_posting_district || "",
    trainee.mobile_number || "",
    trainee.education || "",
    formatDate(trainee.date_of_birth),
    formatDate(trainee.date_of_joining),
    trainee.blood_group || "",
    trainee.nominee || "",
    trainee.home_address || ""
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
}

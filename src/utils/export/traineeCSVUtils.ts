
import { Trainee } from "@/types/trainee";
import { formatDate } from "@/utils/textUtils";

// Headers for CSV export
const csvHeaders = [
  "पीएनओ",
  "चेस्ट नंबर",
  "नाम",
  "पिता का नाम",
  "वर्तमान तैनाती जिला",
  "मोबाइल नंबर",
  "शिक्षा",
  "जन्म तिथि",
  "नियुक्ति तिथि",
  "रक्त समूह",
  "नामिती",
  "घर का पता",
  "आगमन की तारीख",
  "प्रस्थान की तारीख",
];

/**
 * Creates CSV content from trainee data
 * @param trainees Array of trainees to export
 * @returns CSV content as a string
 */
export const createTraineeCSV = (trainees: Trainee[]): string => {
  if (!trainees || trainees.length === 0) return "";

  // Create CSV header row
  const headerRow = csvHeaders.join(",");

  // Process each trainee into a CSV row
  const rows = trainees.map((trainee) => {
    const values = [
      trainee.pno,
      trainee.chest_no,
      trainee.name,
      trainee.father_name,
      trainee.current_posting_district,
      trainee.mobile_number,
      trainee.education,
      formatDate(trainee.date_of_birth),
      formatDate(trainee.date_of_joining),
      trainee.blood_group,
      trainee.nominee,
      `"${trainee.home_address.replace(/"/g, '""')}"`, // Escape quotes in address
      formatDate(trainee.arrival_date),
      formatDate(trainee.departure_date),
    ];

    return values.join(",");
  });

  // Combine header and data rows
  return [headerRow, ...rows].join("\n");
};

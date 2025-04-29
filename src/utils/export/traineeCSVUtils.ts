import { Trainee } from '@/types/trainee';
import { formatDate } from '@/utils/textUtils';

/**
 * Creates CSV content for trainee export
 */
export const createCSVContent = (trainees: Trainee[]) => {
  // CSV Headers
  const headers = [
    'पी.एन.ओ.',
    'छाती संख्या',
    'नाम',
    'पिता का नाम',
    'प्रशिक्षण आगमन तिथि',
    'प्रशिक्षण समाप्ति तिथि',
    'वर्तमान तैनाती जिला',
    'मोबाइल नंबर',
    'शिक्षा',
    'जन्म तिथि',
    'नियुक्ति तिथि',
    'रक्त समूह',
    'नामांकित व्यक्ति',
    'घर का पता'
  ].join(',');

  // CSV Rows
  const rows = trainees.map(trainee => {
    return [
      trainee.pno || '',
      trainee.chest_no || '',
      trainee.name || '',
      trainee.father_name || '',
      trainee.arrival_date ? formatDate(trainee.arrival_date) : '',
      trainee.departure_date ? formatDate(trainee.departure_date) : '',
      trainee.posting_district || '',
      trainee.mobile_number || '',
      trainee.education || '',
      trainee.date_of_birth ? formatDate(trainee.date_of_birth) : '',
      trainee.joining_date ? formatDate(trainee.joining_date) : '',
      trainee.blood_group || '',
      trainee.nominee || '',
      trainee.home_address || ''
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

// Other utility functions related to CSV export...

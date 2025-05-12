
// Define StaffRank and related types
export type StaffRank = 'CONST' | 'HC' | 'ASI' | 'SI' | 'INSP' | 'DSP' | 'SP' | 'DCP' | 'CP';

// Define Staff interface with required properties
export interface Staff {
  id: string;
  pno: string;
  name: string;
  father_name: string;
  mobile_number: string;
  current_posting_district: string;
  rank: StaffRank;
  date_of_birth: string;
  date_of_joining: string;
  blood_group: string;
  nominee: string;
  home_address: string;
  education: string;
  photo_url?: string;
  class_subject?: string;
  class_no?: string;
  toli_no?: string;
}

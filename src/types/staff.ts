
// Define BloodGroup and StaffRank types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type StaffRank = 
  | 'CONST' 
  | 'HC' 
  | 'ASI' 
  | 'SI' 
  | 'INSP' 
  | 'DSP' 
  | 'SP' 
  | 'DCP' 
  | 'CP'
  // Additional ranks being used in the app 
  | 'R/CONST'
  | 'R/ CONST'
  | 'CONST/PTI'
  | 'CONST/ PTI'
  | 'HC/CP'
  | 'HC/AP'
  | 'HC-ITI'
  | 'HC-PTI'
  | 'SI/AP'
  | 'SI/CP'
  | 'RI'
  | 'RSI'
  | 'Inspector'
  | 'FALL'
  | 'Sweeper'
  | 'Barber'
  | 'Washerman'
  | 'Peon';

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

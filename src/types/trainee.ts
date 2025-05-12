
// Define BloodGroup and TraineeRank types
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type TraineeRank = 'CONST' | 'HC' | 'ASI' | 'SI' | 'INSP' | 'DSP';

// Define Trainee interface with required properties
export interface Trainee {
  id: string;
  pno: string;
  name: string;
  chest_no: string;
  father_name: string;
  arrival_date: string;
  departure_date: string;
  current_posting_district: string;
  mobile_number: string;
  education: string;
  date_of_birth: string;
  date_of_joining: string;
  blood_group: BloodGroup;
  nominee: string;
  home_address: string;
  photo_url?: string;
  toli_no?: string;
  rank?: TraineeRank;
}


// Export blood group type used in both trainee and staff
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

// Define trainee rank type
export type TraineeRank = 
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
  | 'CONST/PTI'
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

// Define Trainee interface
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
  blood_group: string;
  nominee: string;
  home_address: string;
  photo_url?: string;
  rank: TraineeRank;
  toli_no?: string;
}

// Export form values type needed by some components
export interface TraineeFormValues {
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
  rank: TraineeRank;
  nominee: string;
  home_address: string;
  toli_no?: string;
}


export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

export interface Trainee {
  id: string;
  pno: string;
  chest_no: string;
  name: string;
  father_name: string;
  arrival_date: string; // ISO date string
  departure_date: string; // ISO date string
  current_posting_district: string;
  mobile_number: string;
  education: string;
  date_of_birth: string; // ISO date string
  date_of_joining: string; // ISO date string
  blood_group: BloodGroup;
  nominee: string;
  home_address: string;
  created_at?: string;
  updated_at?: string;
}

export interface TraineeFormData extends Omit<Trainee, "id" | "created_at" | "updated_at"> {}

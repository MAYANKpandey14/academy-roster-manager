
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
export type StaffRank = "Instructor" | "ITI" | "PTI" | "SI(Teacher)" | "Mess Staff" | "Cleaning Staff";

export interface Staff {
  id: string;
  pno: string;
  name: string;
  father_name: string;
  rank: StaffRank;
  current_posting_district: string;
  mobile_number: string;
  education: string;
  date_of_birth: string;
  date_of_joining: string;
  blood_group: BloodGroup;
  nominee: string;
  home_address: string;
  toli_no?: string;
  class_no?: string;
  class_subject?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffFormData extends Omit<Staff, "id" | "created_at" | "updated_at"> {}

// Use 'export type' to fix the TS1205 error about reexporting when isolatedModules is enabled
export type { StaffFormValues } from "@/components/staff/StaffFormSchema";

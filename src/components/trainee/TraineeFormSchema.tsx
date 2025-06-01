
import { z } from "zod";
import { BloodGroup, TraineeRank } from "@/types/trainee";

// List of blood groups for selection
export const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// List of ranks for selection
export const traineeRanks: TraineeRank[] = [
  "R/CONST", 
  "CONST", 
  "CONST/PTI",
  "CONST/ITI",
  "HC/CP", 
  "HC/AP", 
  "HC-ITI", 
  "HC-PTI", 
  "SI/AP", 
  "SI/CP", 
  "RI", 
  "RSI", 
  "Inspector"
];

// Schema for form validation
export const traineeFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  chest_no: z.string().min(1, { message: "Chest number is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's name is required" }),
  rank: z.enum([...traineeRanks] as [string, ...string[]]).optional(),
  toli_no: z.string().optional(),
  arrival_date: z.string().min(1, { message: "Arrival date is required" }),
  departure_date: z.string().min(1, { message: "Departure date is required" }),
  category_caste: z.string().optional(),
  current_posting_district: z.string().min(1, { message: "Current posting district is required" }),
  mobile_number: z.string().min(10, { message: "Valid mobile number is required" }),
  education: z.string().min(1, { message: "Education is required" }),
  date_of_birth: z.string().min(1, { message: "Date of birth is required" }),
  date_of_joining: z.string().min(1, { message: "Date of joining is required" }),
  blood_group: z.enum([...bloodGroups] as [string, ...string[]], { required_error: "Blood group is required" }),
  nominee: z.string().min(1, { message: "Nominee is required" }),
  home_address: z.string().min(1, { message: "Home address is required" }),
  photo_url: z.string().optional(),
});

// Type for form values based on the schema
export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

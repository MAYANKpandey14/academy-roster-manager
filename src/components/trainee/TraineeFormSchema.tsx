
import { z } from "zod";

export type TraineeRank = 
  | "R/CONST"
  | "CONST"
  | "CONST/PTI"
  | "CONST/ITI"
  | "HC/CP"
  | "HC/AP"
  | "HC-ITI"
  | "HC-PTI"
  | "SI/AP"
  | "SI/CP"
  | "RI"
  | "RSI"
  | "Inspector";

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

export const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
];

export const traineeFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest number is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's name is required"),
  rank: z.enum(traineeRanks as [TraineeRank, ...TraineeRank[]]),
  category_caste: z.string().optional(),
  mobile_number: z.string().min(10, "Valid mobile number is required"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  date_of_joining: z.string().min(1, "Date of joining is required"),
  arrival_date: z.string().min(1, "Arrival date is required"),
  departure_date: z.string().min(1, "Departure date is required"),
  blood_group: z.string().min(1, "Blood group is required"),
  nominee: z.string().min(1, "Nominee is required"),
  current_posting_district: z.string().min(1, "Current posting district is required"),
  home_address: z.string().min(1, "Home address is required"),
  toli_no: z.string().optional(),
  photo_url: z.string().optional(),
});

export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

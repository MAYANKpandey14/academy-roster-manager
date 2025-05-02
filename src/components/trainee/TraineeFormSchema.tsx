import { z } from "zod";
import { BloodGroup, TraineeRank } from "@/types/trainee";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export const traineeRanks: TraineeRank[] = [
  "R/CONST", "CONST", "CONST/PTI", "HC/CP", "HC/AP", "HC-ITI", 
  "HC-PTI", "SI/AP", "SI/CP", "RI", "RSI", "Inspector"
];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const traineeFormSchema = z.object({
  pno: z.string().optional(),
  chest_no: z.string().optional(),
  toli_no: z.string().optional(),
  rank: z.enum(traineeRanks as [TraineeRank, ...TraineeRank[]]).optional(),
  name: z.string().optional(),
  father_name: z.string().optional(),
  arrival_date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").optional(),
  departure_date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").optional(),
  current_posting_district: z.string().optional(),
  mobile_number: z.string().optional(),
  education: z.string().optional(),
  date_of_birth: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").optional(),
  date_of_joining: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format").optional(),
  blood_group: z.enum(bloodGroups as [BloodGroup, ...BloodGroup[]]).optional(),
  nominee: z.string().optional(),
  home_address: z.string().optional(),
});

export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

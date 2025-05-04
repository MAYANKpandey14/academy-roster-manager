
import { z } from "zod";
import { TraineeRank, BloodGroup } from "@/types/trainee";

export const traineeRanks: TraineeRank[] = ["R/CONST", "CONST", "CONST/PTI", "HC/CP", "HC/AP", "HC-ITI", "HC-PTI", "SI/AP", "SI/CP", "RI", "RSI", "Inspector"];
export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const traineeFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  chest_no: z.string().min(1, { message: "Chest No is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's Name is required" }),
  rank: z.enum(traineeRanks as [TraineeRank, ...TraineeRank[]], {
    required_error: "Rank is required",
  }),
  toli_no: z.string().optional(),
  arrival_date: z.string().min(1, { message: "Arrival Date is required" }),
  departure_date: z.string().min(1, { message: "Departure Date is required" }),
  current_posting_district: z.string().min(1, { message: "Current Posting District is required" }),
  mobile_number: z.string().min(10, { message: "Mobile Number must be at least 10 digits" }),
  education: z.string().min(1, { message: "Education is required" }),
  date_of_birth: z.string().min(1, { message: "Date of Birth is required" }),
  date_of_joining: z.string().min(1, { message: "Date of Joining is required" }),
  blood_group: z.enum(bloodGroups as [BloodGroup, ...BloodGroup[]], {
    required_error: "Blood Group is required",
  }),
  nominee: z.string().min(1, { message: "Nominee is required" }),
  home_address: z.string().min(1, { message: "Home Address is required" }),
  photo_url: z.string().optional(),
});

export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

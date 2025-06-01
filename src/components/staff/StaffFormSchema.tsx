
import { z } from "zod";
import { BloodGroup, StaffRank } from "@/types/staff";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export const staffRanks: StaffRank[] = ["R/ CONST", "CONST", "CONST/ PTI","CONST/ ITI", "HC/CP", "HC/AP", "HC-ITI", "HC-PTI", "SI/AP", "SI/CP", "RI", "RSI", "Inspector", "FALL", "Sweeper", "Barber", "Washerman", "Peon"];

export const staffFormSchema = z.object({
  pno: z.string().min(1, { message: "PNO is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  father_name: z.string().min(1, { message: "Father's Name is required" }),
  rank: z.string({ required_error: "Rank is required" }),
  current_posting_district: z.string().min(1, { message: "Current Posting District is required" }),
  mobile_number: z.string().min(10, { message: "Mobile Number must be at least 10 digits" }),
  education: z.string().min(1, { message: "Education is required" }),
  date_of_birth: z.string().min(1, { message: "Date of Birth is required" }),
  date_of_joining: z.string().min(1, { message: "Date of Joining is required" }),
  arrival_date: z.string().min(1, { message: "Arrival date is required" }),
  category_caste: z.string().optional(),
  blood_group: z.string({ required_error: "Blood Group is required" }),
  nominee: z.string().min(1, { message: "Nominee is required" }),
  home_address: z.string().min(1, { message: "Home Address is required" }),
  toli_no: z.string().optional(),
  class_no: z.string().optional(),
  class_subject: z.string().optional(),
  photo_url: z.string().optional(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

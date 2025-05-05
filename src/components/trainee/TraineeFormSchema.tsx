
import { z } from "zod";

// Available blood groups
export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const ranks = ["SI", "ASI", "HC", "CONST"] as const;

// Schema for trainee form
export const traineeFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest Number is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  rank: z.string().optional().default("CONST"),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().min(1, "Date of Birth is required"),
  date_of_joining: z.string().min(1, "Date of Joining is required"),
  arrival_date: z.string().min(1, "Training Arrival Date is required"),
  departure_date: z.string().min(1, "Training Departure Date is required"),
  blood_group: z.string().min(1, "Blood Group is required"),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
  toli_no: z.string().optional(),
  photo_url: z.string().optional(),
});

// Type for form values
export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

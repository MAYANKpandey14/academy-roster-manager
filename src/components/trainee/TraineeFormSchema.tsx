
import { z } from "zod";
import { BloodGroup } from "@/types/trainee";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

// Helper function to validate date string format (YYYY-MM-DD)
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const traineeFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest No is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  arrival_date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
  departure_date: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
  date_of_joining: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
  blood_group: z.enum(bloodGroups as [BloodGroup, ...BloodGroup[]], {
    required_error: "Blood Group is required",
  }),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
});

export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

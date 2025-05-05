
import { z } from "zod";

// Define types
export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const staffRanks = ["SI", "ASI", "HC", "CONST", "Other"] as const;

// Schema and form type
export const staffFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  adhaar_number: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's name is required"),
  rank: z.string().min(1, "Rank is required"),
  current_posting_district: z.string().min(1, "Current posting district is required"),
  mobile_number: z.string().min(10, "Mobile number should be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  date_of_joining: z.string().min(1, "Date of joining is required"),
  blood_group: z.string().min(1, "Blood group is required"),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home address is required"),
  toli_no: z.string().optional(),
  class_no: z.string().optional(),
  class_subject: z.string().optional(),
  photo_url: z.string().optional(),
});

// Form values type
export type StaffFormValues = z.infer<typeof staffFormSchema>;

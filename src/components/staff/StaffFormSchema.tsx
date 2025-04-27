
import { z } from "zod";
import { BloodGroup, StaffRank } from "@/types/staff";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
export const staffRanks: StaffRank[] = ["Instructor", "ITI", "PTI", "SI(Teacher)", "Mess Staff", "Cleaning Staff"];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const staffFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  rank: z.enum(staffRanks as [StaffRank, ...StaffRank[]], {
    required_error: "Rank is required",
  }),
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
  toli_no: z.string().optional(),
  class_no: z.string().optional(),
  class_subject: z.string().optional(),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;

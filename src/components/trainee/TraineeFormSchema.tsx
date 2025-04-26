
import { z } from "zod";
import { BloodGroup } from "@/types/trainee";

export const bloodGroups: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const traineeFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  chest_no: z.string().min(1, "Chest No is required"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's Name is required"),
  arrival_date: z.date({
    required_error: "Date of Arrival is required",
  }),
  departure_date: z.date({
    required_error: "Date of Departure is required",
  }),
  current_posting_district: z.string().min(1, "Current Posting District is required"),
  mobile_number: z.string().min(10, "Mobile Number must be at least 10 digits"),
  education: z.string().min(1, "Education is required"),
  date_of_birth: z.date({
    required_error: "Date of Birth is required",
  }),
  date_of_joining: z.date({
    required_error: "Date of Joining is required",
  }),
  blood_group: z.enum(bloodGroups as [BloodGroup, ...BloodGroup[]], {
    required_error: "Blood Group is required",
  }),
  nominee: z.string().min(1, "Nominee is required"),
  home_address: z.string().min(1, "Home Address is required"),
});

export type TraineeFormValues = z.infer<typeof traineeFormSchema>;

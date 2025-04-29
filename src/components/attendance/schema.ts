
import { z } from "zod";

// Define form schema for attendance and leave records
export const attendanceFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
  leave_type: z.string().optional(),
  start_date: z.date({
    required_error: "Please select a start date",
  }),
  end_date: z.date({
    required_error: "Please select an end date",
  }),
  reason: z.string().optional(),
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

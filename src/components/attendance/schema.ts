
import * as z from "zod";

export const attendanceFormSchema = z.object({
  status: z.string().min(1, "स्थिति आवश्यक है"),
  leave_type: z.string().optional(),
  start_date: z.date({
    required_error: "शुरू की तिथि आवश्यक है",
  }),
  end_date: z.date({
    required_error: "अंत की तिथि आवश्यक है",
  }),
  reason: z.string().optional(),
}).refine((data) => {
  // If status is 'on_leave', leave_type is required
  if (data.status === 'on_leave' && !data.leave_type) {
    return false;
  }
  return true;
}, {
  message: "अवकाश प्रकार आवश्यक है",
  path: ["leave_type"],
}).refine((data) => {
  // Ensure end_date is not before start_date
  return data.end_date >= data.start_date;
}, {
  message: "अंत की तिथि शुरू की तिथि के बाद होनी चाहिए",
  path: ["end_date"],
});

export type AttendanceFormValues = z.infer<typeof attendanceFormSchema>;

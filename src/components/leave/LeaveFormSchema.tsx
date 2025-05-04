
import * as z from "zod";

export const leaveFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  reason: z.string().min(1, "Reason is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
}).refine((data) => {
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  return end >= start;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

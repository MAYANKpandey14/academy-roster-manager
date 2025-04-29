
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAttendance, AttendanceRecord } from "@/hooks/useAttendance";
import { format } from "date-fns";

const attendanceSchema = z.object({
  pno: z.string().min(1, { message: "पीएनओ अनिवार्य है" }),
  name: z.string().min(1, { message: "नाम अनिवार्य है" }),
  rank: z.string().optional(),
  phone: z.string().optional(),
  type: z.enum(["Absent", "On Leave"], { 
    required_error: "अनुपस्थिति प्रकार अनिवार्य है" 
  }),
  leave_type: z.enum(["CL", "EL", "ML", "Maternity Leave"]).optional()
    .nullable()
    .refine(
      (val) => val !== null && val !== undefined, 
      { message: "छुट्टी का प्रकार अनिवार्य है", path: ["leave_type"] }
    ),
  date_from: z.string().min(1, { message: "प्रारंभ तिथि अनिवार्य है" }),
  date_to: z.string().min(1, { message: "अंतिम तिथि अनिवार्य है" }),
  reason: z.string().optional(),
});

export default function AttendanceForm() {
  const [isLeaveSelected, setIsLeaveSelected] = useState(false);
  const queryClient = useQueryClient();
  const { addAttendance } = useAttendance();
  const mutation = addAttendance(queryClient);

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      pno: "",
      name: "",
      rank: "",
      phone: "",
      type: "Absent",
      leave_type: null,
      date_from: format(new Date(), "yyyy-MM-dd"),
      date_to: format(new Date(), "yyyy-MM-dd"),
      reason: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof attendanceSchema>) => {
    const attendanceData: AttendanceRecord = {
      ...data,
      // If Absent is selected, leave_type should be null
      leave_type: data.type === "Absent" ? null : data.leave_type,
    };
    
    mutation.mutate(attendanceData);
  };

  // Watch the type field to conditionally show/hide leave type
  const attendanceType = form.watch("type");
  
  // Update state when type changes
  useState(() => {
    setIsLeaveSelected(attendanceType === "On Leave");
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mangal">अनुपस्थिति / अवकाश दर्ज करें</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">पीएनओ</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-mangal" />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">नाम</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-mangal" />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">रैंक</FormLabel>
                    <FormControl>
                      <Input {...field} className="font-mangal" />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">फोन नंबर</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-mangal">अनुपस्थिति प्रकार</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setIsLeaveSelected(value === "On Leave");
                        // Reset leave_type if Absent is selected
                        if (value === "Absent") {
                          form.setValue("leave_type", null);
                        }
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Absent" />
                        </FormControl>
                        <FormLabel className="font-normal font-mangal">
                          अनुपस्थित
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="On Leave" />
                        </FormControl>
                        <FormLabel className="font-normal font-mangal">
                          छुट्टी पर
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="font-mangal" />
                </FormItem>
              )}
            />
            
            {isLeaveSelected && (
              <FormField
                control={form.control}
                name="leave_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">छुट्टी का प्रकार</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            placeholder="छुट्टी का प्रकार चुनें" 
                            className="font-mangal" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CL" className="font-mangal">आकस्मिक अवकाश (CL)</SelectItem>
                        <SelectItem value="EL" className="font-mangal">अर्जित अवकाश (EL)</SelectItem>
                        <SelectItem value="ML" className="font-mangal">चिकित्सा अवकाश (ML)</SelectItem>
                        <SelectItem value="Maternity Leave" className="font-mangal">मातृत्व अवकाश</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">प्रारंभ तिथि</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">अंतिम तिथि</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
            </div>
            
            {isLeaveSelected && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mangal">कारण</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="font-mangal" />
                    </FormControl>
                    <FormMessage className="font-mangal" />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full font-mangal"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "प्रोसेसिंग..." : "जमा करें"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

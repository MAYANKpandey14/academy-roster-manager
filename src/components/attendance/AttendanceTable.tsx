
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Edit, Trash } from "lucide-react";
import { TableView } from "@/components/ui/table-view";
import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord } from "@/components/attendance/types";
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { ActionType, TableAction } from "../ui/table-view/types";

export function AttendanceTable() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: attendanceData, isLoading, refetch } = useQuery({
    queryKey: ['attendance', date],
    queryFn: async () => {
      if (!date) return [];

      const formattedDate = format(date, 'yyyy-MM-dd');

      try {
        // Instead of querying a non-existent table, call the edge function
        const { data, error } = await supabase.functions.invoke('get-attendance', {
          body: { date: formattedDate }
        });

        if (error) {
          console.error("Error fetching attendance:", error);
          throw error;
        }

        return data as AttendanceRecord[];
      } catch (error) {
        console.error("Error fetching attendance:", error);
        return [];
      }
    },
    enabled: !!date,
  });

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const actions: TableAction<AttendanceRecord>[] = [
    {
      type: "view" as ActionType,
      label: "देखें",
      icon: <Eye className="h-4 w-4" />,
      onClick: (record) => {
        console.log("View record:", record);
        // Open view modal logic
      }
    },
    {
      type: "edit" as ActionType,
      label: "संपादित करें",
      icon: <Edit className="h-4 w-4" />,
      onClick: (record) => {
        console.log("Edit record:", record);
        // Open edit modal logic
      }
    },
    {
      type: "delete" as ActionType,
      label: "हटाएं",
      icon: <Trash className="h-4 w-4" />,
      onClick: (record) => {
        console.log("Delete record:", record);
        if (window.confirm("क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?")) {
          // Delete logic
        }
      }
    }
  ];

  const columns = [
    {
      accessorKey: 'pno',
      header: 'पी.एन.ओ.',
    },
    {
      accessorKey: 'name',
      header: 'नाम',
    },
    {
      accessorKey: 'rank',
      header: 'पद',
    },
    {
      accessorKey: 'phone',
      header: 'फ़ोन',
    },
    {
      accessorKey: 'type',
      header: 'प्रकार',
    },
    {
      accessorKey: 'leave_type',
      header: 'छुट्टी का प्रकार',
    },
    {
      accessorKey: 'date_from',
      header: 'से',
    },
    {
      accessorKey: 'date_to',
      header: 'तक',
    },
    {
      accessorKey: 'reason',
      header: 'कारण',
    },
  ];

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>तारीख चुनें</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <DatePicker
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="border-none shadow-none"
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => refetch()} disabled={isLoading}>रीफ्रेश</Button>
      </div>

      <TableView
        data={attendanceData || []}
        columns={columns}
        isLoading={isLoading}
        actions={actions}
        onRefresh={() => refetch()}
      />
    </div>
  );
}

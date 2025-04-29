
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableView } from "@/components/ui/table-view/TableView";
import { useAttendance } from "@/hooks/useAttendance";
import { Eye, Download, Printer, RefreshCw, Search, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AttendanceTable() {
  const [pnoFilter, setPnoFilter] = useState("");
  const [searchPno, setSearchPno] = useState("");
  const queryClient = useQueryClient();
  
  const { data: attendance, isLoading, refetch } = useAttendance().fetchAttendance(pnoFilter || undefined);

  const handleSearch = () => {
    setPnoFilter(searchPno);
  };

  const handleShowAll = () => {
    setPnoFilter("");
    setSearchPno("");
  };

  const handleRefresh = () => {
    refetch();
  };

  const columns = [
    {
      accessorKey: "pno",
      header: "पीएनओ",
      cell: ({ row }) => <span className="font-mangal">{row.getValue("pno")}</span>
    },
    {
      accessorKey: "name",
      header: "नाम",
      cell: ({ row }) => <span className="font-mangal">{row.getValue("name")}</span>
    },
    {
      accessorKey: "type",
      header: "प्रकार",
      cell: ({ row }) => {
        const type = row.getValue("type");
        return (
          <Badge variant={type === "Absent" ? "destructive" : "outline"} className="font-mangal">
            {type === "Absent" ? "अनुपस्थित" : "छुट्टी पर"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "leave_type",
      header: "छुट्टी प्रकार",
      cell: ({ row }) => {
        const leaveType = row.getValue("leave_type");
        return leaveType ? <span className="font-mangal">{leaveType}</span> : "-";
      }
    },
    {
      accessorKey: "date_from",
      header: "तिथि से",
      cell: ({ row }) => format(new Date(row.getValue("date_from")), "dd/MM/yyyy")
    },
    {
      accessorKey: "date_to",
      header: "तिथि तक",
      cell: ({ row }) => format(new Date(row.getValue("date_to")), "dd/MM/yyyy")
    }
  ];

  const actions = [
    {
      type: "view",
      label: "देखें",
      icon: <Eye className="h-4 w-4" />,
      onClick: (record) => {
        // View attendance details
        console.log("View attendance", record);
      }
    },
    {
      type: "print",
      label: "प्रिंट",
      icon: <Printer className="h-4 w-4" />,
      onClick: (record) => {
        // Print attendance
        console.log("Print attendance", record);
        // Implementation for printing can be added here
      }
    },
    {
      type: "download",
      label: "डाउनलोड",
      icon: <FileDown className="h-4 w-4" />,
      onClick: (record) => {
        // Download attendance
        console.log("Download attendance", record);
        // Implementation for downloading can be added here
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mangal">अनुपस्थिति रिकॉर्ड</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 font-mangal">
              पीएनओ से खोजें
            </label>
            <div className="flex gap-2">
              <Input
                value={searchPno}
                onChange={(e) => setSearchPno(e.target.value)}
                placeholder="पीएनओ दर्ज करें"
                className="font-mangal"
              />
              <Button onClick={handleSearch} className="shrink-0 font-mangal">
                <Search className="h-4 w-4 mr-1" />
                खोजें
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShowAll} className="font-mangal">
              सभी दिखाएं
            </Button>
            <Button variant="outline" onClick={handleRefresh} className="font-mangal">
              <RefreshCw className="h-4 w-4 mr-1" />
              रिफ्रेश
            </Button>
          </div>
        </div>

        <TableView
          data={attendance || []}
          columns={columns}
          isLoading={isLoading}
          filterColumn="name"
          filterPlaceholder="नाम से खोजें..."
          actions={actions}
          onRefresh={handleRefresh}
          totalLabelKey="totalItems"
        />
      </CardContent>
    </Card>
  );
}


import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffById } from "@/services/staffApi";
import { Staff } from "@/types/staff";
import { format } from "date-fns";
import { toast } from "sonner";
import { Printer, Download } from "lucide-react";
import { createStaffPrintContent, createStaffCSVContent, handlePrint, handleDownload } from "@/utils/staffExportUtils";

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await getStaffById(id);
        
        if (error) throw error;
        
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Failed to fetch staff details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handlePrintStaff = () => {
    if (!staff) return;
    
    const content = createStaffPrintContent([staff]);
    handlePrint(content);
    toast.success("Printing staff details");
  };

  const handleDownloadStaff = () => {
    if (!staff) return;
    
    const content = createStaffCSVContent([staff]);
    handleDownload(content, `staff_${staff.pno}_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Staff details downloaded as CSV");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">View Staff Details</h1>
          </div>
          <Card>
            <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
              <p className="text-muted-foreground">Loading staff details...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">View Staff Details</h1>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-500 my-8">Staff not found or has been deleted.</p>
              <Button onClick={() => navigate("/staff")}>
                Return to Staff List
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">View Staff Details</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintStaff}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownloadStaff}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              Back
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">PNO</p>
                      <p>{staff.pno}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{staff.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Father's Name</p>
                      <p>{staff.father_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rank</p>
                      <p>{staff.rank}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
                      <p>{staff.mobile_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Posting District</p>
                      <p>{staff.current_posting_district}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Education</p>
                      <p>{staff.education}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                      <p>{staff.blood_group}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nominee</p>
                      <p>{staff.nominee}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Dates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                      <p>{staff.date_of_birth ? format(new Date(staff.date_of_birth), "PPP") : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date of Joining</p>
                      <p>{staff.date_of_joining ? format(new Date(staff.date_of_joining), "PPP") : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Address</h2>
                  <p>{staff.home_address}</p>
                </div>
                
                {(staff.toli_no || staff.class_no || staff.class_subject) && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {staff.toli_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Toli Number</p>
                          <p>{staff.toli_no}</p>
                        </div>
                      )}
                      {staff.class_no && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Class Number</p>
                          <p>{staff.class_no}</p>
                        </div>
                      )}
                      {staff.class_subject && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Class Subject</p>
                          <p>{staff.class_subject}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewStaff;

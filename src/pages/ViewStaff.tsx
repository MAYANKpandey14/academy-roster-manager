
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">View Staff Details</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(`/edit-staff/${id}`)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => navigate("/staff")}>
              Back
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500 my-8">
              Staff details for ID: {id} will be displayed here in the next phase.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => {
                toast.info("Staff details view will be implemented soon");
                navigate("/staff");
              }}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ViewStaff;

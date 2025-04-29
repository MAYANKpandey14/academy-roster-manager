
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { AttendanceManagement } from "@/components/attendance/AttendanceManagement";

export default function AttendancePage() {
  return (
    <Layout>
      <div className="container py-6 space-y-6">
        <PageHeader
          title="उपस्थिति प्रबंधन"
          description="प्रशिक्षुओं और स्टाफ की अनुपस्थिति और अवकाश रिकॉर्ड प्रबंधित करें"
        />
        
        <AttendanceManagement />
      </div>
    </Layout>
  );
}

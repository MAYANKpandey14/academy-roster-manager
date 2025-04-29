
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AttendanceLeaveForm } from "./AttendanceLeaveForm";
import { LeaveHistoryTable } from "./LeaveHistoryTable";

export function AttendanceManagement() {
  const { t, i18n } = useTranslation();
  const [pno, setPno] = useState("");
  const [personData, setPersonData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'trainee' | 'staff'>('trainee');

  const handleSearch = async () => {
    if (!pno.trim()) {
      toast.error("कृपया पीएनओ दर्ज करें");
      return;
    }

    setIsSearching(true);

    try {
      const table = activeTab === 'trainee' ? 'trainees' : 'staff';
      const { data, error } = await supabase
        .from(table)
        .select('id, name, rank, mobile_number, pno')
        .eq('pno', pno.trim())
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error(`${activeTab === 'trainee' ? 'प्रशिक्षु' : 'स्टाफ'} नहीं मिला`);
        setPersonData(null);
        return;
      }

      setPersonData(data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("डेटा खोजने में समस्या हुई");
      setPersonData(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear person data when tab changes
  useEffect(() => {
    setPersonData(null);
    setPno("");
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Section 1: Search by PNO */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">पीएनओ से खोजें</h2>
            
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 flex-grow">
                <Label htmlFor="pno">पीएनओ नंबर</Label>
                <Input
                  id="pno"
                  value={pno}
                  onChange={(e) => setPno(e.target.value)}
                  placeholder="पीएनओ दर्ज करें (9-अंक)"
                  maxLength={9}
                  lang={i18n.language}
                  className="max-w-md"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="flex items-center gap-2"
              >
                <SearchIcon size={18} />
                <span>{isSearching ? 'खोज रहा है...' : 'खोजें'}</span>
              </Button>
            </div>

            {personData && (
              <div className="mt-4 p-4 border rounded-md bg-accent/20">
                <h3 className="font-medium mb-2">व्यक्ति विवरण:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">नाम</p>
                    <p className="font-krutidev">{personData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">पद</p>
                    <p className="font-krutidev">{personData.rank || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">फ़ोन नंबर</p>
                    <p className="font-krutidev">{personData.mobile_number}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Tabs for Trainee/Staff */}
      <Tabs defaultValue="trainee" onValueChange={(value) => setActiveTab(value as 'trainee' | 'staff')}>
        <TabsList className="mb-4">
          <TabsTrigger value="trainee" className="dynamic-text">प्रशिक्षु उपस्थिति</TabsTrigger>
          <TabsTrigger value="staff" className="dynamic-text">स्टाफ उपस्थिति</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trainee" className="space-y-6">
          <AttendanceLeaveForm 
            type="trainee" 
            personId={personData?.id} 
            onSuccess={() => {
              // Reset form and refresh data if needed
              toast.success("डेटा सफलतापूर्वक सहेजा गया");
            }}
          />
          
          {personData?.id && (
            <LeaveHistoryTable 
              type="trainee"
              personId={personData.id}
            />
          )}
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-6">
          <AttendanceLeaveForm 
            type="staff" 
            personId={personData?.id}
            onSuccess={() => {
              // Reset form and refresh data if needed
              toast.success("डेटा सफलतापूर्वक सहेजा गया");
            }}
          />
          
          {personData?.id && (
            <LeaveHistoryTable 
              type="staff"
              personId={personData.id}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

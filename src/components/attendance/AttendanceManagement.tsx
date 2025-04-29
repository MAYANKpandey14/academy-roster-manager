
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PersonType } from "./types";
import { PersonSearch } from "./search/PersonSearch";
import { PersonDetails } from "./display/PersonDetails";
import { AttendanceTabs } from "./AttendanceTabs";

export function AttendanceManagement() {
  const [personData, setPersonData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<PersonType>('trainee');

  // Clear person data when tab changes
  useEffect(() => {
    setPersonData(null);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Section 1: Search by PNO */}
      <Card>
        <CardContent className="pt-6">
          <PersonSearch 
            activeTab={activeTab}
            onPersonFound={setPersonData}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />
          <PersonDetails personData={personData} />
        </CardContent>
      </Card>

      {/* Section 2: Tabs for Trainee/Staff */}
      <AttendanceTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        personData={personData}
      />
    </div>
  );
}

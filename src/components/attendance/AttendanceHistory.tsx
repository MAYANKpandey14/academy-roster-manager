
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFetchAttendance } from './hooks/useFetchAttendance';
import { PersonType } from './types/attendanceTypes';
import { AttendanceTable } from './AttendanceTable';
import { LeaveHistoryTable } from './components/LeaveHistoryTable';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface AttendanceHistoryProps {
  personId: string;
  personType: PersonType;
}

export const AttendanceHistory = ({ personId, personType }: AttendanceHistoryProps) => {
  const { isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave'>('attendance');

  const { data, isLoading, error } = useFetchAttendance(personId, personType);

  console.log("AttendanceHistory data:", data);
  console.log("AttendanceHistory loading:", isLoading);
  console.log("AttendanceHistory error:", error);

  if (isLoading) {
    return (
      <Card className="p-6 text-center">
        <p className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'लोड हो रहा है...' : 'Loading...'}
        </p>
      </Card>
    );
  }

  if (error) {
    console.error("Error in AttendanceHistory:", error);
    return (
      <Card className="p-6 text-center bg-red-50">
        <p className="text-red-600">
          {isHindi ? 'डेटा लोड करने में त्रुटि' : 'Error loading data'}
        </p>
      </Card>
    );
  }

  const { attendance = [], leave = [] } = data || {};

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'attendance' | 'leave')}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="attendance" className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'उपस्थिति' : 'Attendance'} ({attendance.length})
          </TabsTrigger>
          <TabsTrigger value="leave" className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'छुट्टी' : 'Leave'} ({leave.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-0">
          <AttendanceTable 
            attendanceRecords={attendance} 
            personType={personType} 
          />
        </TabsContent>

        <TabsContent value="leave" className="mt-0">
          <LeaveHistoryTable 
            personId={personId} 
            personType={personType} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Download, Calendar, Filter } from 'lucide-react';
import { Personnel } from '@/types/attendance';
import { AttendanceHistoryTable } from './AttendanceHistoryTable';
import { LeaveHistoryTable } from './LeaveHistoryTable';
import { useLanguage } from '@/contexts/LanguageContext';

interface AttendanceHistoryProps {
  selectedPerson: Personnel;
}

export function AttendanceHistory({ selectedPerson }: AttendanceHistoryProps) {
  const { isHindi } = useLanguage();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [activeTab, setActiveTab] = useState('attendance');

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting data for:', selectedPerson.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'उपस्थिति और छुट्टी का इतिहास' : 'Attendance & Leave History'}
          </span>
          <Button onClick={handleExport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            {isHindi ? 'निर्यात' : 'Export'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className={`text-sm font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'फिल्टर:' : 'Filter:'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <DatePicker
              date={dateFrom}
              onSelect={setDateFrom}
              placeholder={isHindi ? 'से तारीख' : 'From Date'}
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <DatePicker
              date={dateTo}
              onSelect={setDateTo}
              placeholder={isHindi ? 'तक तारीख' : 'To Date'}
            />
          </div>
          <Button variant="outline" size="sm">
            {isHindi ? 'लागू करें' : 'Apply'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'उपस्थिति रिकॉर्ड' : 'Attendance Records'}
            </TabsTrigger>
            <TabsTrigger value="leave" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'छुट्टी रिकॉर्ड' : 'Leave Records'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="mt-4">
            <AttendanceHistoryTable 
              personId={selectedPerson.id}
              personType={selectedPerson.type}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </TabsContent>

          <TabsContent value="leave" className="mt-4">
            <LeaveHistoryTable 
              personId={selectedPerson.id}
              personType={selectedPerson.type}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

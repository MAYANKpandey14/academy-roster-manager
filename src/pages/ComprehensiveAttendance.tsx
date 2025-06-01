
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Search, History, BarChart3 } from 'lucide-react';
import { AdvancedPersonnelSearch } from '@/components/attendance/AdvancedPersonnelSearch';
import { ComprehensiveAttendanceForm } from '@/components/attendance/ComprehensiveAttendanceForm';
import { Personnel } from '@/types/attendance';

export default function ComprehensiveAttendance() {
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);
  const [selectedPersonType, setSelectedPersonType] = useState<'staff' | 'trainee' | 'all'>('all');
  const [activeTab, setActiveTab] = useState('mark');

  const handlePersonSelect = (person: Personnel) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  const handleRecordCreated = (record: any) => {
    console.log('Record created:', record);
    // Refresh data or show success message
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Comprehensive Attendance & Leave Management
          </h1>
          <p className="text-gray-600">
            Complete attendance tracking, leave management, and analytics for staff and trainees
          </p>
        </div>

        {/* Personnel Type Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Personnel Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-auto">
                <Select 
                  value={selectedPersonType} 
                  onValueChange={(value: 'staff' | 'trainee' | 'all') => setSelectedPersonType(value)}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Personnel</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="trainee">Trainees Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full">
                <AdvancedPersonnelSearch
                  onPersonSelect={handlePersonSelect}
                  selectedPersonType={selectedPersonType}
                  placeholder={`Search ${selectedPersonType === 'all' ? 'all personnel' : selectedPersonType + 's'} by name, PNO, or ID...`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mark" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History & Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="approvals" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Approvals
            </TabsTrigger>
          </TabsList>

          {/* Mark Attendance Tab */}
          <TabsContent value="mark">
            <ComprehensiveAttendanceForm
              selectedPerson={selectedPerson}
              onRecordCreated={handleRecordCreated}
            />
          </TabsContent>

          {/* History & Reports Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPerson ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">
                      Attendance history for {selectedPerson.first_name} {selectedPerson.last_name} will be displayed here.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      This feature will show comprehensive attendance records, leave history, and generate reports.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">
                      Select a person to view their attendance history
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Comprehensive analytics and insights will be available here
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Features: Attendance trends, leave utilization, department-wise reports, and visual charts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">
                    Approval management system will be available here
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Features: Pending leave requests, status change approvals, and bulk approval actions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Person Summary */}
        {selectedPerson && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Selected Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {selectedPerson.first_name[0]}{selectedPerson.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedPerson.first_name} {selectedPerson.last_name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedPerson.pno} • {selectedPerson.type.toUpperCase()} • {selectedPerson.designation}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{selectedPerson.department || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

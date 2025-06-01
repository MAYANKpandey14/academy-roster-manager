
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Search, History, BarChart3, CheckCircle } from 'lucide-react';
import { AdvancedPersonnelSearch } from '@/components/attendance/AdvancedPersonnelSearch';
import { ComprehensiveAttendanceForm } from '@/components/attendance/ComprehensiveAttendanceForm';
import { AttendanceHistory } from '@/components/attendance/history/AttendanceHistory';
import { AttendanceAnalytics } from '@/components/attendance/analytics/AttendanceAnalytics';
import { PendingApprovals } from '@/components/attendance/approvals/PendingApprovals';
import { Personnel } from '@/types/attendance';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ComprehensiveAttendance() {
  const { isHindi } = useLanguage();
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
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'व्यापक उपस्थिति और छुट्टी प्रबंधन' : 'Comprehensive Attendance & Leave Management'}
          </h1>
          <p className={`text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi 
              ? 'कर्मचारियों और प्रशिक्षुओं के लिए पूर्ण उपस्थिति ट्रैकिंग, छुट्टी प्रबंधन और विश्लेषण'
              : 'Complete attendance tracking, leave management, and analytics for staff and trainees'
            }
          </p>
        </div>

        {/* Personnel Type Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <Search className="h-5 w-5" />
              {isHindi ? 'कर्मचारी खोज' : 'Personnel Search'}
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
                    <SelectItem value="all">{isHindi ? 'सभी कर्मचारी' : 'All Personnel'}</SelectItem>
                    <SelectItem value="staff">{isHindi ? 'केवल स्टाफ' : 'Staff Only'}</SelectItem>
                    <SelectItem value="trainee">{isHindi ? 'केवल प्रशिक्षु' : 'Trainees Only'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full">
                <AdvancedPersonnelSearch
                  onPersonSelect={handlePersonSelect}
                  selectedPersonType={selectedPersonType}
                  placeholder={isHindi 
                    ? `${selectedPersonType === 'all' ? 'सभी कर्मचारियों' : selectedPersonType === 'staff' ? 'स्टाफ' : 'प्रशिक्षुओं'} को नाम, PNO, या ID से खोजें...`
                    : `Search ${selectedPersonType === 'all' ? 'all personnel' : selectedPersonType + 's'} by name, PNO, or ID...`
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mark" className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <CalendarDays className="h-4 w-4" />
              {isHindi ? 'उपस्थिति दर्ज करें' : 'Mark Attendance'}
            </TabsTrigger>
            <TabsTrigger value="history" className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <History className="h-4 w-4" />
              {isHindi ? 'इतिहास' : 'History'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <BarChart3 className="h-4 w-4" />
              {isHindi ? 'विश्लेषण' : 'Analytics'}
            </TabsTrigger>
            <TabsTrigger value="approvals" className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <CheckCircle className="h-4 w-4" />
              {isHindi ? 'अनुमोदन' : 'Approvals'}
            </TabsTrigger>
            <TabsTrigger value="reports" className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
              <Search className="h-4 w-4" />
              {isHindi ? 'रिपोर्ट' : 'Reports'}
            </TabsTrigger>
          </TabsList>

          {/* Mark Attendance Tab */}
          <TabsContent value="mark">
            <ComprehensiveAttendanceForm
              selectedPerson={selectedPerson}
              onRecordCreated={handleRecordCreated}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            {selectedPerson ? (
              <AttendanceHistory selectedPerson={selectedPerson} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'उपस्थिति इतिहास' : 'Attendance History'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className={`text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'उपस्थिति इतिहास देखने के लिए कोई व्यक्ति चुनें' : 'Select a person to view their attendance history'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AttendanceAnalytics />
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals">
            <PendingApprovals />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? 'रिपोर्ट जेनरेशन' : 'Report Generation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className={`text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi 
                      ? 'रिपोर्ट जेनरेशन सिस्टम यहाँ उपलब्ध होगा'
                      : 'Report generation system will be available here'
                    }
                  </p>
                  <p className={`text-sm text-gray-400 mt-2 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi
                      ? 'विशेषताएं: कस्टम रिपोर्ट, PDF/Excel एक्सपोर्ट, समूह रिपोर्ट और निर्धारित रिपोर्ट।'
                      : 'Features: Custom reports, PDF/Excel export, bulk reports, and scheduled reports.'
                    }
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
              <CardTitle className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'चयनित कर्मचारी' : 'Selected Personnel'}
              </CardTitle>
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
                  <p className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'विभाग' : 'Department'}
                  </p>
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

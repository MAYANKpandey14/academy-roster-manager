
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnalyticsData {
  totalPersonnel: number;
  totalAttendanceRecords: number;
  averageAttendance: number;
  pendingApprovals: number;
  monthlyData: Array<{
    month: string;
    present: number;
    absent: number;
    leave: number;
  }>;
  leaveTypeData: Array<{
    type: string;
    count: number;
    color: string;
  }>;
}

export function AttendanceAnalytics() {
  const { isHindi } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch total personnel count
      const [staffResult, traineeResult] = await Promise.all([
        supabase.from('staff').select('id', { count: 'exact' }),
        supabase.from('trainees').select('id', { count: 'exact' })
      ]);

      const totalPersonnel = (staffResult.count || 0) + (traineeResult.count || 0);

      // Fetch attendance records for analytics
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_leave_records')
        .select('*')
        .gte('record_date', new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);

      if (attendanceError) throw attendanceError;

      // Process monthly data
      const monthlyMap = new Map();
      const leaveTypeMap = new Map();
      let pendingCount = 0;

      attendanceData?.forEach(record => {
        const month = new Date(record.record_date).toLocaleString('default', { month: 'short' });
        
        if (!monthlyMap.has(month)) {
          monthlyMap.set(month, { month, present: 0, absent: 0, leave: 0 });
        }

        const monthData = monthlyMap.get(month);
        if (record.status === 'present') monthData.present++;
        else if (record.status === 'absent') monthData.absent++;
        else if (record.status === 'leave') {
          monthData.leave++;
          if (record.leave_type) {
            leaveTypeMap.set(record.leave_type, (leaveTypeMap.get(record.leave_type) || 0) + 1);
          }
        }

        if (record.approval_status === 'pending') pendingCount++;
      });

      const monthlyData = Array.from(monthlyMap.values());
      const leaveTypeData = Array.from(leaveTypeMap.entries()).map(([type, count], index) => ({
        type,
        count,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
      }));

      const totalAttendanceRecords = attendanceData?.length || 0;
      const presentRecords = attendanceData?.filter(r => r.status === 'present').length || 0;
      const averageAttendance = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

      setAnalytics({
        totalPersonnel,
        totalAttendanceRecords,
        averageAttendance,
        pendingApprovals: pendingCount,
        monthlyData,
        leaveTypeData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">{isHindi ? 'विश्लेषण लोड हो रहा है...' : 'Loading analytics...'}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">{isHindi ? 'डेटा उपलब्ध नहीं है' : 'No data available'}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'कुल कर्मचारी' : 'Total Personnel'}
                </p>
                <p className="text-2xl font-bold">{analytics.totalPersonnel}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'औसत उपस्थिति' : 'Average Attendance'}
                </p>
                <p className="text-2xl font-bold">{analytics.averageAttendance.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'कुल रिकॉर्ड' : 'Total Records'}
                </p>
                <p className="text-2xl font-bold">{analytics.totalAttendanceRecords}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'लंबित अनुमोदन' : 'Pending Approvals'}
                </p>
                <p className="text-2xl font-bold">{analytics.pendingApprovals}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'मासिक उपस्थिति ट्रेंड' : 'Monthly Attendance Trends'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10B981" name={isHindi ? 'उपस्थित' : 'Present'} />
              <Bar dataKey="absent" fill="#EF4444" name={isHindi ? 'अनुपस्थित' : 'Absent'} />
              <Bar dataKey="leave" fill="#F59E0B" name={isHindi ? 'छुट्टी' : 'Leave'} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Leave Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'छुट्टी के प्रकार का वितरण' : 'Leave Type Distribution'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.leaveTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.leaveTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

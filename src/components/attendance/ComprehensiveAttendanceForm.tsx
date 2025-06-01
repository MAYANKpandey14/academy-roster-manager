
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, XCircle, Calendar, AlertTriangle, UserX, Trash2, Info, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Personnel } from '@/types/attendance';

interface ComprehensiveAttendanceFormProps {
  selectedPerson: Personnel | null;
  onRecordCreated?: (record: any) => void;
}

export const ComprehensiveAttendanceForm: React.FC<ComprehensiveAttendanceFormProps> = ({
  selectedPerson,
  onRecordCreated
}) => {
  const [activeTab, setActiveTab] = useState('absent');
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Record<string, any>>({
    absent: {
      date: new Date().toISOString().split('T')[0],
      reason: ''
    },
    leave: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      leaveType: '',
      reason: ''
    },
    suspension: {
      date: new Date().toISOString().split('T')[0],
      reason: ''
    },
    resignation: {
      date: new Date().toISOString().split('T')[0],
      reason: ''
    },
    termination: {
      date: new Date().toISOString().split('T')[0],
      reason: ''
    }
  });

  const updateFormData = (type: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('attendance_attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('attendance_attachments')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (type: string) => {
    if (!selectedPerson) {
      toast({
        title: "Error",
        description: "Please select a person first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Get current user session for created_by field
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      let attachmentUrl: string | null = null;
      if (attachmentFile) {
        attachmentUrl = await handleFileUpload(attachmentFile);
        if (!attachmentUrl) {
          throw new Error('Failed to upload attachment');
        }
      }

      const currentFormData = formData[type];
      
      let payload: any;

      switch (type) {
        case 'absent':
          payload = {
            personnel_id: selectedPerson.id,
            personnel_type: selectedPerson.type,
            record_type: 'attendance',
            status: 'absent',
            record_date: currentFormData.date,
            reason: currentFormData.reason,
            attachment_url: attachmentUrl,
            created_by: session.user.id
          };
          break;
        case 'leave':
          payload = {
            personnel_id: selectedPerson.id,
            personnel_type: selectedPerson.type,
            record_type: 'leave',
            status: 'leave',
            leave_type: currentFormData.leaveType as 'EL' | 'CL' | 'ML' | 'Maternity' | 'Special',
            record_date: currentFormData.startDate,
            start_date: currentFormData.startDate,
            end_date: currentFormData.endDate,
            reason: currentFormData.reason,
            attachment_url: attachmentUrl,
            created_by: session.user.id
          };
          break;
        default:
          payload = {
            personnel_id: selectedPerson.id,
            personnel_type: selectedPerson.type,
            record_type: 'status_change',
            status: type as 'suspension' | 'resignation' | 'termination',
            record_date: currentFormData.date,
            reason: currentFormData.reason,
            attachment_url: attachmentUrl,
            created_by: session.user.id
          };
      }

      const { data, error } = await supabase
        .from('attendance_leave_records')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} recorded successfully`,
      });

      resetForm(type);
      setAttachmentFile(null);
      
      if (onRecordCreated) {
        onRecordCreated(data);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to record ${type}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = (type: string) => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      [type]: type === 'leave' 
        ? { startDate: today, endDate: today, leaveType: '', reason: '' }
        : { date: today, reason: '' }
    }));
  };

  if (!selectedPerson) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Search and select a person to mark attendance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Attendance / Leave</CardTitle>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Selected:</span>
          <span className="font-medium">
            {selectedPerson.first_name} {selectedPerson.last_name} ({selectedPerson.pno})
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="absent" className="flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Absent
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Leave
            </TabsTrigger>
            <TabsTrigger value="suspension" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Suspension
            </TabsTrigger>
            <TabsTrigger value="resignation" className="flex items-center gap-1">
              <UserX className="h-4 w-4" />
              Resignation
            </TabsTrigger>
            <TabsTrigger value="termination" className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Termination
            </TabsTrigger>
          </TabsList>

          <TabsContent value="absent" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Absent records are automatically approved upon submission.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="absent-date">Date</Label>
                <Input
                  id="absent-date"
                  type="date"
                  value={formData.absent.date}
                  onChange={(e) => updateFormData('absent', 'date', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="absent-reason">Reason</Label>
              <Textarea
                id="absent-reason"
                placeholder="Enter reason for absence..."
                value={formData.absent.reason}
                onChange={(e) => updateFormData('absent', 'reason', e.target.value)}
                rows={3}
              />
            </div>
            
            <Button 
              onClick={() => handleSubmit('absent')}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Recording..." : "Mark as Absent"}
            </Button>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Leave requests require approval from supervisors.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leave-start">Start Date</Label>
                <Input
                  id="leave-start"
                  type="date"
                  value={formData.leave.startDate}
                  onChange={(e) => updateFormData('leave', 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="leave-end">End Date</Label>
                <Input
                  id="leave-end"
                  type="date"
                  value={formData.leave.endDate}
                  onChange={(e) => updateFormData('leave', 'endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select 
                value={formData.leave.leaveType} 
                onValueChange={(value) => updateFormData('leave', 'leaveType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                  <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                  <SelectItem value="ML">Medical Leave (ML)</SelectItem>
                  <SelectItem value="Maternity">Maternity Leave</SelectItem>
                  <SelectItem value="Special">Special Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="leave-reason">Reason</Label>
              <Textarea
                id="leave-reason"
                placeholder="Enter reason for leave..."
                value={formData.leave.reason}
                onChange={(e) => updateFormData('leave', 'reason', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="leave-attachment">Attachment (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="leave-attachment"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
              {attachmentFile && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {attachmentFile.name}
                </p>
              )}
            </div>
            
            <Button 
              onClick={() => handleSubmit('leave')}
              disabled={isLoading || !formData.leave.leaveType}
              className="w-full"
            >
              {isLoading ? "Submitting..." : "Submit Leave Request"}
            </Button>
          </TabsContent>

          {['suspension', 'resignation', 'termination'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action will change the person's status and requires supervisor approval.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${status}-date`}>Effective Date</Label>
                  <Input
                    id={`${status}-date`}
                    type="date"
                    value={formData[status].date}
                    onChange={(e) => updateFormData(status, 'date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`${status}-reason`}>Reason</Label>
                <Textarea
                  id={`${status}-reason`}
                  placeholder={`Enter reason for ${status}...`}
                  value={formData[status].reason}
                  onChange={(e) => updateFormData(status, 'reason', e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => handleSubmit(status)}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
              >
                {isLoading ? "Recording..." : `Record ${status.charAt(0).toUpperCase() + status.slice(1)}`}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ArchiveViewModalProps {
  record: ArchivedStaff | ArchivedTrainee | null;
  type: 'staff' | 'trainee';
  isOpen: boolean;
  onClose: () => void;
}

export function ArchiveViewModal({ record, type, isOpen, onClose }: ArchiveViewModalProps) {
  const { isHindi } = useLanguage();

  if (!record) return null;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const isTrainee = (record: ArchivedStaff | ArchivedTrainee): record is ArchivedTrainee => {
    return 'chest_no' in record;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-xl ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 
              `आर्काइव किया गया ${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} विवरण` : 
              `Archived ${type === 'staff' ? 'Staff' : 'Trainee'} Details`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with photo and basic info */}
          <div className="flex items-start space-x-6 p-4 bg-gray-50 rounded-lg">
            {record.photo_url && (
              <img 
                src={record.photo_url} 
                alt={record.name}
                className="w-24 h-24 rounded-lg object-cover border"
              />
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{record.name}</h2>
              <p className="text-gray-600">{record.father_name}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">
                  {isHindi ? 'पीएनओ' : 'PNO'}: {record.pno}
                </Badge>
                {isTrainee(record) && (
                  <Badge variant="secondary">
                    {isHindi ? 'चेस्ट नं' : 'Chest No'}: {record.chest_no}
                  </Badge>
                )}
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {isHindi ? 'आर्काइव' : 'Archived'}: {formatDate(record.archived_at)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className={`font-semibold text-lg ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'जन्म तिथि:' : 'Date of Birth:'}
                </span>
                <span>{formatDate(record.date_of_birth)}</span>
                
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'रक्त समूह:' : 'Blood Group:'}
                </span>
                <span>{record.blood_group}</span>
                
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'शिक्षा:' : 'Education:'}
                </span>
                <span>{record.education}</span>
                
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'मोबाइल:' : 'Mobile:'}
                </span>
                <span>{record.mobile_number}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className={`font-semibold text-lg ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'सेवा जानकारी' : 'Service Information'}
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'ज्वाइनिंग तिथि:' : 'Date of Joining:'}
                </span>
                <span>{formatDate(record.date_of_joining)}</span>
                
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'रैंक:' : 'Rank:'}
                </span>
                <span>{record.rank || 'CONST'}</span>
                
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'वर्तमान पोस्टिंग:' : 'Current Posting:'}
                </span>
                <span>{record.current_posting_district}</span>
                
                {isTrainee(record) && (
                  <>
                    <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'आगमन तिथि:' : 'Arrival Date:'}
                    </span>
                    <span>{formatDate(record.arrival_date)}</span>
                    
                    <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? 'प्रस्थान तिथि:' : 'Departure Date:'}
                    </span>
                    <span>{formatDate(record.departure_date)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Address and Additional Info */}
          <div className="space-y-3">
            <h3 className={`font-semibold text-lg ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'पता और अतिरिक्त जानकारी' : 'Address & Additional Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'घर का पता:' : 'Home Address:'}
                </span>
                <p className="mt-1">{record.home_address}</p>
              </div>
              
              <div>
                <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'नामांकित व्यक्ति:' : 'Nominee:'}
                </span>
                <p className="mt-1">{record.nominee}</p>
              </div>
              
              {record.toli_no && (
                <div>
                  <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'टोली नं:' : 'Toli No:'}
                  </span>
                  <p className="mt-1">{record.toli_no}</p>
                </div>
              )}
              
              {record.class_no && (
                <div>
                  <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'क्लास नं:' : 'Class No:'}
                  </span>
                  <p className="mt-1">{record.class_no}</p>
                </div>
              )}
            </div>
          </div>

          {/* Archive Information */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className={`font-semibold text-lg mb-2 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'आर्काइव जानकारी' : 'Archive Information'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'आर्काइव तिथि:' : 'Archived Date:'}
              </span>
              <span>{formatDate(record.archived_at)}</span>
              
              {record.archived_by && (
                <>
                  <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'आर्काइव करने वाला:' : 'Archived By:'}
                  </span>
                  <span>{record.archived_by}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Users, Phone, Mail, Building, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Personnel } from '@/types/attendance';

interface AdvancedPersonnelSearchProps {
  onPersonSelect: (person: Personnel) => void;
  placeholder?: string;
  selectedPersonType?: 'staff' | 'trainee' | 'all';
}

export const AdvancedPersonnelSearch: React.FC<AdvancedPersonnelSearchProps> = ({
  onPersonSelect,
  placeholder = "Search by name, PNO, or unique ID...",
  selectedPersonType = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Personnel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, selectedPersonType]);

  const performSearch = async (term: string) => {
    try {
      setIsLoading(true);
      
      // Search in both staff and trainees tables
      const staffPromise = supabase
        .from('staff')
        .select('id, pno, name, father_name, mobile_number, current_posting_district, education, rank')
        .or(`name.ilike.%${term}%, pno.ilike.%${term}%`)
        .limit(10);

      const traineePromise = supabase
        .from('trainees')
        .select('id, pno, chest_no, name, father_name, mobile_number, current_posting_district, education, rank')
        .or(`name.ilike.%${term}%, pno.ilike.%${term}%, chest_no.ilike.%${term}%`)
        .limit(10);

      const [staffResponse, traineeResponse] = await Promise.all([staffPromise, traineePromise]);

      const results: Personnel[] = [];

      // Process staff results
      if (staffResponse.data && (selectedPersonType === 'all' || selectedPersonType === 'staff')) {
        staffResponse.data.forEach(staff => {
          const names = staff.name.split(' ');
          results.push({
            id: staff.id,
            pno: staff.pno,
            unique_id: staff.pno, // Using PNO as unique_id for existing data
            first_name: names[0] || '',
            last_name: names.slice(1).join(' ') || '',
            phone: staff.mobile_number,
            department: staff.current_posting_district,
            designation: staff.rank,
            type: 'staff',
            status: 'active', // Default status
            created_at: '',
            updated_at: ''
          });
        });
      }

      // Process trainee results
      if (traineeResponse.data && (selectedPersonType === 'all' || selectedPersonType === 'trainee')) {
        traineeResponse.data.forEach(trainee => {
          const names = trainee.name.split(' ');
          results.push({
            id: trainee.id,
            pno: trainee.pno,
            unique_id: trainee.chest_no || trainee.pno,
            first_name: names[0] || '',
            last_name: names.slice(1).join(' ') || '',
            phone: trainee.mobile_number,
            department: trainee.current_posting_district,
            designation: trainee.rank,
            type: 'trainee',
            status: 'active', // Default status
            created_at: '',
            updated_at: ''
          });
        });
      }

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonSelect = (person: Personnel) => {
    setSearchTerm(`${person.first_name} ${person.last_name} (${person.pno})`);
    setShowResults(false);
    onPersonSelect(person);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto shadow-lg">
          <CardContent className="p-0">
            {searchResults.map((person) => (
              <div
                key={person.id}
                onClick={() => handlePersonSelect(person)}
                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {person.type === 'staff' ? (
                        <Users className="h-4 w-4 text-blue-500" />
                      ) : (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">
                        {person.first_name} {person.last_name}
                      </span>
                      <Badge variant={person.type === 'staff' ? 'default' : 'secondary'}>
                        {person.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="font-mono">PNO: {person.pno}</span>
                        <span className="font-mono">ID: {person.unique_id}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {person.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{person.phone}</span>
                          </div>
                        )}
                        {person.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{person.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {person.department && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{person.department}</span>
                          </div>
                        )}
                        {person.designation && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{person.designation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={person.status === 'active' ? 'default' : 'destructive'}
                    className="ml-2"
                  >
                    {person.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && searchResults.length === 0 && !isLoading && searchTerm.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500">
            No personnel found matching "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

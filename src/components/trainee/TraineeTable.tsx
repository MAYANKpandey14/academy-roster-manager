
import { useState, useEffect } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Trainee } from "@/types/trainee";
import { TraineeTableActions } from "./table/TraineeTableActions";
import { getTraineeTableColumns } from "./table/TraineeTableColumns";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TraineeTableProps {
  trainees: Trainee[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TraineeTable({ trainees, onRefresh, isLoading = false }: TraineeTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const { isHindi } = useLanguage();
  const [sortedTrainees, setSortedTrainees] = useState<Trainee[]>(trainees);
  const [sortBy, setSortBy] = useState<string>("none");
  
  // Get table columns using getTraineeTableColumns function
  const columns = getTraineeTableColumns(isHindi, onRefresh);
  
  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  // Update sorted trainees when original trainees array or sort option changes
  useEffect(() => {
    let sorted = [...trainees]; // Create a copy to avoid mutating props
    
    if (sortBy === "toli_no") {
      sorted = sorted.sort((a, b) => {
        // Handle null/undefined toli_no values
        if (!a.toli_no) return 1;
        if (!b.toli_no) return -1;
        return a.toli_no.localeCompare(b.toli_no, undefined, { numeric: true });
      });
    } else if (sortBy === "chest_no") {
      sorted = sorted.sort((a, b) => {
        return a.chest_no.localeCompare(b.chest_no, undefined, { numeric: true });
      });
    }
    
    setSortedTrainees(sorted);
  }, [trainees, sortBy]);

  function getSelectedTrainees(): Trainee[] {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => sortedTrainees[index]);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">
            {isHindi ? "इसके अनुसार क्रमबद्ध करें:" : "Sort by:"}
          </span>
          <Select 
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder={isHindi ? "क्रमबद्ध करें" : "Sort by"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">
                  {isHindi ? "कोई क्रम नहीं" : "None"}
                </SelectItem>
                <SelectItem value="toli_no">
                  {isHindi ? "टोली नंबर" : "Toli No"}
                </SelectItem>
                <SelectItem value="chest_no">
                  {isHindi ? "चेस्ट नंबर" : "Chest No"}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <TraineeTableActions
          trainees={trainees}
          sortedTrainees={sortedTrainees}
          sortBy={sortBy}
          isLoading={isLoading}
          selectedCount={selectedCount}
          getSelectedTrainees={getSelectedTrainees}
          onRefresh={onRefresh}
        />
      </div>
      
      <DataTable
        columns={columns}
        data={sortedTrainees}
        filterColumn="name"
        filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
        totalLabel={isHindi ? "कुल प्रशिक्षानिवेशी" : "Total Trainees"}
      />
    </div>
  );
}

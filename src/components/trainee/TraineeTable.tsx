
import { useState, useEffect } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Trainee } from "@/types/trainee";
import { TraineeTableActions } from "./table/TraineeTableActions";
import { useTraineeTableColumns } from "./table/TraineeTableColumns";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  // Get table columns
  const columns = useTraineeTableColumns(isLoading);
  
  useEffect(() => {
    // Update selected count when rowSelection changes
    setSelectedCount(Object.keys(rowSelection).length);
  }, [rowSelection]);

  function getSelectedTrainees(): Trainee[] {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => trainees[index]);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <TraineeTableActions
        trainees={trainees}
        isLoading={isLoading}
        selectedCount={selectedCount}
        getSelectedTrainees={getSelectedTrainees}
        onRefresh={onRefresh}
      />
      
      <DataTable
        columns={columns}
        data={trainees}
        filterColumn="name"
        filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
        isLoading={isLoading}
        onRowSelectionChange={setRowSelection}
        rowSelection={rowSelection}
      />
    </div>
  );
}

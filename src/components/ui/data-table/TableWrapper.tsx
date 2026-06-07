import { flexRender } from "@tanstack/react-table";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableWrapperProps {
  table: any;
  columns: any[];
  isLoading: boolean;
}

export function TableWrapper({ table, columns, isLoading }: TableWrapperProps) {
  const { isHindi } = useLanguage();
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className={isHindi ? 'font-mangal' : ''}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-16 text-center">
                <span className={isHindi ? 'font-mangal' : ''}>
                  {isHindi ? "लोड हो रहा है..." : "Loading..."}
                </span>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-2 py-8">
                  <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                    <svg
                      className="h-6 w-6 text-slate-400 dark:text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m16 0h-1.5m-13.5 0H5"
                      />
                    </svg>
                  </div>
                  <h3 className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${isHindi ? 'font-mangal' : ''}`}>
                    {isHindi ? "कोई रिकॉर्ड नहीं मिला" : "No Records Found"}
                  </h3>
                  <p className={`text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto ${isHindi ? 'font-mangal' : ''}`}>
                    {isHindi 
                      ? "आपके खोज मापदंड से मेल खाता हुआ कोई डेटा उपलब्ध नहीं है।" 
                      : "There are no matching entries. Try adjusting your search filters or add new records."}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


/**
 * Token-based exact matching filter for table columns
 * Splits values on common separators and matches complete tokens only
 */
export function tokenExactMatchFilter(row: any, columnId: string, filterValue: string): boolean {
  const rawValue = String(row.getValue(columnId) || '').trim().toLowerCase();
  const keyword = String(filterValue || '').trim().toLowerCase();

  // If no keyword provided, show all rows
  if (!keyword) return true;

  // Split the raw value into tokens using common separators
  const tokens = rawValue.split(/[-_/\s]+/).filter(token => token.length > 0);
  
  // Check if any token exactly matches the keyword
  return tokens.includes(keyword);
}

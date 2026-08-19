import { useCallback, useEffect, useState } from 'react';

const EMPTY_FILTERS = { from: '', to: '', column: '', value: '', search: '' };

// Shared by every "synced from a Google Sheet, dynamic columns" section
// (Form Data, Entrepreneur Submissions, ...) — fetching, filter state, and
// defensive fallbacks for the { columns, rows } response shape are identical
// across sources; only the fetch/sync functions differ.
export function useSheetSync(fetchFn) {
  const [sheetColumns, setSheetColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFn(filters);
      setSheetColumns(Array.isArray(data?.columns) ? data.columns : []);
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    sheetColumns,
    rows,
    loading,
    filters,
    setFilters,
    reload: loadData,
    clearFilters: () => setFilters(EMPTY_FILTERS)
  };
}

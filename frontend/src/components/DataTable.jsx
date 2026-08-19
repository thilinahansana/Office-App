import { useTranslation } from 'react-i18next';

/**
 * Generic table: columns + rows are passed in as props so all three list
 * pages (form data, monthly work, entrepreneurs) can share one implementation.
 *
 * columns: [{ key: string, label: string, render?: (row) => ReactNode }]
 */
export default function DataTable({ columns, rows, loading }) {
  const { t } = useTranslation();

  // Defensive: if a caller's API response shape doesn't match what this
  // component expects (e.g. an object instead of an array, from a stale
  // build talking to a newer API), render an empty table instead of
  // crashing the whole page on `.map is not a function`.
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="card-surface data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {safeColumns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading &&
            safeRows.map((row) => (
              <tr key={row._id || row.sourceRowNumber}>
                {safeColumns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key] ?? ''}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {loading && <div className="data-table-empty">{t('common.loading')}</div>}
      {!loading && safeRows.length === 0 && <div className="data-table-empty">{t('common.noResults')}</div>}
    </div>
  );
}

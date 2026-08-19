import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from './DataTable';
import FilterBar from './FilterBar';

/**
 * Generic "synced from a Google Sheet, dynamic columns" panel — used by both
 * the Form Data page and the Entrepreneur Submissions section. Table columns
 * and the "filter by column" dropdown are built from whatever columns the
 * linked Sheet currently has (via the useSheetSync hook), so this component
 * never needs to know a form's fields ahead of time.
 */
export default function SheetSyncPanel({ title, syncFn, sheetSync }) {
  const { t } = useTranslation();
  const { sheetColumns, rows, loading, filters, setFilters, reload, clearFilters } = sheetSync;
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const columns = useMemo(
    () => [
      ...sheetColumns.map((col) => ({
        key: col,
        label: col,
        render: (row) => row.fields?.[col] ?? ''
      })),
      {
        key: 'submittedAt',
        label: t('sheetSync.columns.submittedAt'),
        render: (row) => (row.submittedAt ? new Date(row.submittedAt).toLocaleString() : '')
      },
      {
        key: 'syncedAt',
        label: t('sheetSync.columns.syncedAt'),
        render: (row) => (row.syncedAt ? new Date(row.syncedAt).toLocaleString() : '')
      }
    ],
    [sheetColumns, t]
  );

  const filterFields = useMemo(
    () => [
      { name: 'from', label: t('common.from'), type: 'date' },
      { name: 'to', label: t('common.to'), type: 'date' },
      {
        name: 'column',
        label: t('sheetSync.filters.column'),
        type: 'select',
        options: sheetColumns.map((col) => ({ value: col, label: col }))
      },
      { name: 'value', label: t('sheetSync.filters.value'), type: 'text' },
      { name: 'search', label: t('sheetSync.filters.search'), type: 'text' }
    ],
    [t, sheetColumns]
  );

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncFn();
      setSyncMessage({ type: 'success', ...result });
      await reload();
    } catch {
      setSyncMessage({ type: 'error' });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>{title}</h2>
        <button type="button" className="btn" onClick={handleSync} disabled={syncing}>
          {syncing ? t('sheetSync.syncing') : t('sheetSync.syncNow')}
        </button>
      </div>

      {syncMessage?.type === 'success' && (
        <p>{t('sheetSync.syncSuccess', { inserted: syncMessage.inserted, checked: syncMessage.checked })}</p>
      )}
      {syncMessage?.type === 'error' && <p className="form-error">{t('sheetSync.syncError')}</p>}

      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
        onClear={clearFilters}
      />

      <DataTable columns={columns} rows={rows} loading={loading} />
    </div>
  );
}

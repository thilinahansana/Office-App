import { useTranslation } from 'react-i18next';

/**
 * Generic filter row: shape of the filters is passed in as props so all
 * three list pages can share one implementation.
 *
 * fields: [{ name: string, label: string, type: 'text' | 'date' | 'select', options?: [{value, label}] }]
 * values: { [name]: string }
 */
export default function FilterBar({ fields, values, onChange, onClear }) {
  const { t } = useTranslation();
  const safeFields = Array.isArray(fields) ? fields : [];

  return (
    <div className="card-surface filter-bar">
      {safeFields.map((field) => (
        <div className="filter-field" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              className="input-field"
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            >
              <option value="">{t('common.all')}</option>
              {(Array.isArray(field.options) ? field.options : []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              className="input-field"
              type={field.type || 'text'}
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={onClear}>
        {t('common.clearFilters')}
      </button>
    </div>
  );
}

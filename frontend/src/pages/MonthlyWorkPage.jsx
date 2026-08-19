import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import MonthlyWorkCard from '../components/MonthlyWorkCard';
import MonthlyWorkDetailModal from '../components/MonthlyWorkDetailModal';
import {
  fetchMonthlyWork,
  fetchMonthlyWorkMonths,
  createMonthlyWork,
  updateMonthlyWork,
  deleteMonthlyWork
} from '../api/monthlyWork';
import { isDriveFileLink } from '../utils/googleDrive';

const EMPTY_FILTERS = { from: '', to: '', month: '', search: '' };
const EMPTY_FORM = { workTitle: '', description: '', venue: '', date: '', profitCount: '' };

function monthLabel(monthStr, language) {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });
}

export default function MonthlyWorkPage() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageLinks, setImageLinks] = useState(['']);
  const [saving, setSaving] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const filterFields = useMemo(
    () => [
      { name: 'from', label: t('common.from'), type: 'date' },
      { name: 'to', label: t('common.to'), type: 'date' },
      {
        name: 'month',
        label: t('monthlyWork.filters.month'),
        type: 'select',
        options: availableMonths.filter(Boolean).map((m) => ({ value: m, label: monthLabel(m, i18n.language) }))
      },
      { name: 'search', label: t('monthlyWork.filters.search'), type: 'text' }
    ],
    [t, availableMonths, i18n.language]
  );

  const loadMonths = useCallback(async () => {
    const months = await fetchMonthlyWorkMonths();
    setAvailableMonths(months);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMonthlyWork(filters);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadMonths();
  }, [loadMonths]);

  function updateImageLink(index, value) {
    setImageLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  }

  function addImageLink() {
    setImageLinks((prev) => [...prev, '']);
  }

  function removeImageLink(index) {
    setImageLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImageLinks(['']);
    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(item) {
    setSelectedItem(null);
    setEditingId(item._id);
    setForm({
      workTitle: item.workTitle || '',
      description: item.description || '',
      venue: item.venue || '',
      date: item.date ? item.date.slice(0, 10) : '',
      profitCount: item.profitCount ?? ''
    });
    setImageLinks(item.images?.length ? item.images : ['']);
    setShowModal(true);
  }

  async function handleDelete(item) {
    if (!window.confirm(t('common.deleteConfirm'))) return;
    await deleteMonthlyWork(item._id);
    setSelectedItem(null);
    await loadData();
    await loadMonths();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        profitCount: form.profitCount !== '' ? Number(form.profitCount) : undefined,
        images: imageLinks.map((link) => link.trim()).filter(Boolean)
      };
      if (editingId) {
        await updateMonthlyWork(editingId, payload);
      } else {
        await createMonthlyWork(payload);
      }
      setShowModal(false);
      resetForm();
      await loadData();
      await loadMonths();
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <Header />
      <div className="page-container">
        <div className="page-header">
          <h2>
            <Link to="/">←</Link> {t('monthlyWork.title')}
          </h2>
          <div className="header-bar__actions">
            <button type="button" className="btn btn-secondary" onClick={handlePrint}>
              {t('common.print')}
            </button>
            <button type="button" className="btn" onClick={openAddModal}>
              {t('monthlyWork.addItem')}
            </button>
          </div>
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />

        {loading && <div className="data-table-empty">{t('common.loading')}</div>}
        {!loading && rows.length === 0 && <div className="data-table-empty">{t('monthlyWork.noItems')}</div>}
        {!loading && rows.length > 0 && (
          <div className="work-card-grid">
            {rows.map((item) => (
              <MonthlyWorkCard key={item._id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}

        {selectedItem && (
          <MonthlyWorkDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}

        {showModal && (
          <Modal
            title={editingId ? t('monthlyWork.editItem') : t('monthlyWork.addItem')}
            onClose={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="mw-workTitle">{t('monthlyWork.form.workTitle')}</label>
                <input
                  id="mw-workTitle"
                  className="input-field"
                  value={form.workTitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, workTitle: e.target.value }))}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="mw-description">{t('monthlyWork.form.description')}</label>
                <textarea
                  id="mw-description"
                  className="input-field"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="mw-venue">{t('monthlyWork.form.venue')}</label>
                <input
                  id="mw-venue"
                  className="input-field"
                  value={form.venue}
                  onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label htmlFor="mw-date">{t('monthlyWork.form.date')}</label>
                <input
                  id="mw-date"
                  className="input-field"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="mw-profitCount">{t('monthlyWork.form.profitCount')}</label>
                <input
                  id="mw-profitCount"
                  className="input-field"
                  type="number"
                  step="any"
                  value={form.profitCount}
                  onChange={(e) => setForm((prev) => ({ ...prev, profitCount: e.target.value }))}
                />
              </div>

              <div className="form-field">
                <label>{t('monthlyWork.form.images')}</label>
                <p className="form-help">{t('monthlyWork.form.imagesHelp')}</p>
                {imageLinks.map((link, index) => (
                  <div key={index}>
                    <div className="image-link-row">
                      <input
                        className="input-field"
                        type="url"
                        placeholder={t('monthlyWork.form.imageUrlPlaceholder')}
                        value={link}
                        onChange={(e) => updateImageLink(index, e.target.value)}
                      />
                      {imageLinks.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => removeImageLink(index)}
                        >
                          {t('monthlyWork.form.removeImageLink')}
                        </button>
                      )}
                    </div>
                    {link.trim() && !isDriveFileLink(link) && (
                      <p className="field-warning">{t('monthlyWork.form.invalidLink')}</p>
                    )}
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addImageLink}>
                  {t('monthlyWork.form.addImageLink')}
                </button>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {t('monthlyWork.form.submit')}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>

      {/* Print view: filtered data as a plain table, no images (only rendered on paper via @media print). */}
      <div className="print-only">
        <h2>{t('monthlyWork.printTitle')}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('monthlyWork.columns.workTitle')}</th>
              <th>{t('monthlyWork.columns.description')}</th>
              <th>{t('monthlyWork.columns.venue')}</th>
              <th>{t('monthlyWork.columns.date')}</th>
              <th>{t('monthlyWork.columns.profitCount')}</th>
              <th>{t('monthlyWork.columns.createdBy')}</th>
              <th>{t('monthlyWork.columns.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item._id}>
                <td>{item.workTitle}</td>
                <td>{item.description}</td>
                <td>{item.venue}</td>
                <td>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                <td>{item.profitCount ?? ''}</td>
                <td>{item.createdBy}</td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

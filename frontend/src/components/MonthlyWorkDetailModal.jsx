import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import ImageSlideshow from './ImageSlideshow';

export default function MonthlyWorkDetailModal({ item, onClose, onEdit, onDelete }) {
  const { t, i18n } = useTranslation();

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(i18n.language === 'si' ? 'si-LK' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <Modal title={item.workTitle} onClose={onClose} size="lg">
      <div className="work-detail">
        <ImageSlideshow images={item.images} />

        <div className="work-detail__row">
          <span className="work-detail__label">{t('monthlyWork.columns.date')}</span>
          <span>{formattedDate}</span>
        </div>
        {item.venue && (
          <div className="work-detail__row">
            <span className="work-detail__label">{t('monthlyWork.columns.venue')}</span>
            <span>{item.venue}</span>
          </div>
        )}
        <div className="work-detail__row">
          <span className="work-detail__label">{t('monthlyWork.columns.description')}</span>
          <span>{item.description}</span>
        </div>
        {item.profitCount != null && item.profitCount !== '' && (
          <div className="work-detail__row">
            <span className="work-detail__label">{t('monthlyWork.columns.profitCount')}</span>
            <span>{item.profitCount}</span>
          </div>
        )}
        {item.createdBy && (
          <div className="work-detail__row">
            <span className="work-detail__label">{t('monthlyWork.columns.createdBy')}</span>
            <span>{item.createdBy}</span>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-danger" onClick={() => onDelete(item)}>
            {t('common.delete')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onEdit(item)}>
            {t('common.edit')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}

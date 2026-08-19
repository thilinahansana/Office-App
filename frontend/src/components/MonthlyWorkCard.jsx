import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { driveThumbnailUrl } from '../utils/googleDrive';

export default function MonthlyWorkCard({ item, onClick }) {
  const { t, i18n } = useTranslation();
  const [imgFailed, setImgFailed] = useState(false);

  const coverImage = item.images?.[0];
  const thumbUrl = coverImage ? driveThumbnailUrl(coverImage, 500) : null;
  const showImage = thumbUrl && !imgFailed;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(i18n.language === 'si' ? 'si-LK' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : '';

  return (
    <div
      className="card-surface work-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(item)}
    >
      <div className="work-card__cover">
        {showImage ? (
          <img src={thumbUrl} alt="" loading="lazy" onError={() => setImgFailed(true)} />
        ) : (
          <div className="work-card__cover-placeholder">
            {coverImage ? t('monthlyWork.imageUnavailable') : formattedDate}
          </div>
        )}
        {item.images?.length > 0 && (
          <span className="work-card__photo-badge">
            {t('monthlyWork.photoCount', { count: item.images.length })}
          </span>
        )}
      </div>
      <div className="work-card__body">
        <div className="work-card__month">{formattedDate}</div>
        <h4 className="work-card__description">{item.workTitle}</h4>
        {item.venue && <span className="work-card__category">{item.venue}</span>}
      </div>
    </div>
  );
}

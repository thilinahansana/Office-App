import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { driveThumbnailUrl } from '../utils/googleDrive';

// Large single-image-at-a-time slideshow (used in the Monthly Work detail
// popover) rather than a grid of small thumbnails, so photos are actually
// viewable without opening each one in a new tab.
export default function ImageSlideshow({ images }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(() => new Set());

  if (!images || images.length === 0) {
    return null;
  }

  const url = images[index];
  const thumbUrl = driveThumbnailUrl(url, 1000);
  const isBroken = !thumbUrl || failed.has(index);

  function goTo(i) {
    setIndex((i + images.length) % images.length);
  }

  function markFailed(i) {
    setFailed((prev) => new Set(prev).add(i));
  }

  return (
    <div className="slideshow">
      <div className="slideshow__main">
        {images.length > 1 && (
          <button
            type="button"
            className="slideshow__nav slideshow__nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        {isBroken ? (
          <div className="slideshow__broken">{t('monthlyWork.imageUnavailable')}</div>
        ) : (
          <a href={url} target="_blank" rel="noreferrer" title={t('monthlyWork.detail.openInDrive')}>
            <img src={thumbUrl} alt="" onError={() => markFailed(index)} />
          </a>
        )}

        {images.length > 1 && (
          <button
            type="button"
            className="slideshow__nav slideshow__nav--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next"
          >
            ›
          </button>
        )}

        {images.length > 1 && (
          <span className="slideshow__count">
            {index + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="slideshow__dots">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              className={`slideshow__dot${i === index ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

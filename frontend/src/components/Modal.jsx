export default function Modal({ title, onClose, children, size }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`card-surface modal-content${size === 'lg' ? ' modal-content--lg' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

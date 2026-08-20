import { useNavigate } from 'react-router-dom';

export default function DashboardCard({ icon, index, title, cta, to }) {
  const navigate = useNavigate();

  return (
    <div
      className="card-surface dashboard-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
    >
      <div className="dashboard-card__visual">
        <span className="dashboard-card__icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <span className="dashboard-card__number" aria-hidden="true">
        {index}
      </span>
      <div className="dashboard-card__body">
        <h3>{title}</h3>
        <span className="dashboard-card__cta">{cta} →</span>
      </div>
    </div>
  );
}

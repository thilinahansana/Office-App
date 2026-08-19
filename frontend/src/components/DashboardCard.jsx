import { useNavigate } from 'react-router-dom';

export default function DashboardCard({ title, description, to }) {
  const navigate = useNavigate();

  return (
    <div
      className="card-surface dashboard-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

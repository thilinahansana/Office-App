import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <div className="page-container">
        <div className="page-intro">
          <span className="eyebrow">{t('dashboard.eyebrow')}</span>
          <h1>{t('dashboard.welcome')}</h1>
        </div>
        <div className="dashboard-grid">
          <DashboardCard
            icon="📋"
            index={1}
            title={t('dashboard.formDataTitle')}
            cta={t('dashboard.openCta')}
            to="/form-data"
          />
          <DashboardCard
            icon="🗓️"
            index={2}
            title={t('dashboard.monthlyWorkTitle')}
            cta={t('dashboard.openCta')}
            to="/monthly-work"
          />
          <DashboardCard
            icon="👥"
            index={3}
            title={t('dashboard.entrepreneursTitle')}
            cta={t('dashboard.openCta')}
            to="/entrepreneurs"
          />
        </div>
      </div>
    </div>
  );
}

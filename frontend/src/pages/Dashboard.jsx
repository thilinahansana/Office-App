import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <div className="page-container">
        <p>{t('dashboard.welcome')}</p>
        <div className="dashboard-grid">
          <DashboardCard
            title={t('dashboard.formDataTitle')}
            description={t('dashboard.formDataDesc')}
            to="/form-data"
          />
          <DashboardCard
            title={t('dashboard.monthlyWorkTitle')}
            description={t('dashboard.monthlyWorkDesc')}
            to="/monthly-work"
          />
          <DashboardCard
            title={t('dashboard.entrepreneursTitle')}
            description={t('dashboard.entrepreneursDesc')}
            to="/entrepreneurs"
          />
        </div>
      </div>
    </div>
  );
}

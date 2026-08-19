import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SheetSyncPanel from '../components/SheetSyncPanel';
import { useSheetSync } from '../hooks/useSheetSync';
import { fetchEntrepreneurSubmissions, runEntrepreneurSync } from '../api/entrepreneurSubmissions';

export default function EntrepreneursPage() {
  const { t } = useTranslation();
  const entrepreneurSync = useSheetSync(fetchEntrepreneurSubmissions);

  return (
    <div>
      <Header />
      <div className="page-container">
        <SheetSyncPanel
          title={
            <>
              <Link to="/">←</Link> {t('entrepreneurs.title')}
            </>
          }
          syncFn={runEntrepreneurSync}
          sheetSync={entrepreneurSync}
        />
      </div>
    </div>
  );
}

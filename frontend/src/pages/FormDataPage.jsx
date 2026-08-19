import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import SheetSyncPanel from '../components/SheetSyncPanel';
import { useSheetSync } from '../hooks/useSheetSync';
import { fetchFormSubmissions, runFormSync } from '../api/formSubmissions';

export default function FormDataPage() {
  const { t } = useTranslation();
  const sheetSync = useSheetSync(fetchFormSubmissions);

  return (
    <div>
      <Header />
      <div className="page-container">
        <SheetSyncPanel
          eyebrow={t('formData.eyebrow')}
          title={t('formData.title')}
          syncFn={runFormSync}
          sheetSync={sheetSync}
        />
      </div>
    </div>
  );
}

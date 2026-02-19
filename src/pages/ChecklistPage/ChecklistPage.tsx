import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { SectionBlock } from '../../components/SectionBlock';
import { VehicleForm } from '../../components/VehicleForm';
import { useInspectionState } from '../../hooks/useInspectionState';
import { filesToDataUrls } from '../../utils/fileToDataUrl';
import styles from './ChecklistPage.module.scss';

export function ChecklistPage() {
  const { state, updateVehicle, updateItemStatus, updateItemPhotos } = useInspectionState();

  const handleVehicleChange = (field: keyof typeof state.vehicle, value: string) => {
    updateVehicle({ [field]: value });
  };

  return (
    <Layout title="Checklist de Vistoria" showBack>
      <div className={styles.page}>
        <Card className={styles.vehicleCard}>
          <CardHeader>
            <CardTitle>Identificação do Veículo</CardTitle>
          </CardHeader>
          <VehicleForm vehicle={state.vehicle} onChange={handleVehicleChange} />
        </Card>

        <div className={styles.riskBar}>
          <span className={styles.riskLabel}>Risco atual:</span>
          <RiskBadge level={state.riskLevel} score={state.riskScore} size="md" />
        </div>

        <div className={styles.sections}>
          {state.sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              onItemStatus={(itemId, status, observation) =>
                updateItemStatus(section.id, itemId, status, observation)
              }
              onItemPhoto={(itemId, files) => {
                const item = section.items.find((i) => i.id === itemId);
                if (!item) return;
                filesToDataUrls(files, 4).then((urls) => {
                  const current = item.photos ?? [];
                  updateItemPhotos(section.id, itemId, [...current, ...urls].slice(0, 4));
                });
              }}
              onItemPhotosChange={(itemId, photos) => updateItemPhotos(section.id, itemId, photos)}
            />
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/resumo" className={styles.primaryLink}>
            Ver resumo e gerar laudo
          </Link>
        </div>
      </div>
    </Layout>
  );
}

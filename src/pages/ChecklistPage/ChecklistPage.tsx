import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { SectionBlock } from '../../components/SectionBlock';
import { VehicleForm } from '../../components/VehicleForm';
import { useInspectionState } from '../../hooks/useInspectionState';
import styles from './ChecklistPage.module.scss';

export function ChecklistPage() {
  const { state, updateVehicle, updateItemStatus } = useInspectionState();

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
            />
          ))}
        </div>

        <div className={styles.actions}>
          <Button asChild fullWidth size="lg" variant="primary">
            <Link to="/resumo">Ver resumo e gerar laudo</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}

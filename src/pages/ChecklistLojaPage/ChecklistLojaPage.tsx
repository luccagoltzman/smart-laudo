import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { SectionBlock } from '../../components/SectionBlock';
import { VehicleForm } from '../../components/VehicleForm';
import { getVehicleById, mapApiVehicleToIdentification } from '../../api/vehicles';
import { useLojaInspectionState } from '../../hooks/useLojaInspectionState';
import { filesToDataUrls } from '../../utils/fileToDataUrl';
import styles from './ChecklistLojaPage.module.scss';

export function ChecklistLojaPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { state, updateVehicle, updateItemStatus, updateItemPhotos, startInspectionWithVehicle } =
    useLojaInspectionState();
  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>(
    vehicleId ? 'loading' : 'idle'
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) {
      setLoadStatus('idle');
      return;
    }
    let cancelled = false;
    setLoadStatus('loading');
    setLoadError(null);
    getVehicleById(vehicleId)
      .then((apiVehicle) => {
        if (cancelled) return;
        const vehicle = mapApiVehicleToIdentification(apiVehicle);
        startInspectionWithVehicle(vehicle);
        setLoadStatus('ok');
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Erro ao carregar veículo');
        setLoadStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [vehicleId, startInspectionWithVehicle]);

  const handleVehicleChange = (field: keyof typeof state.vehicle, value: string) => {
    updateVehicle({ [field]: value });
  };

  if (loadStatus === 'loading') {
    return (
      <Layout title="Checklist Estado do Carro" showBack>
        <div className={styles.page}>
          <p className={styles.message}>Carregando dados do veículo…</p>
        </div>
      </Layout>
    );
  }

  if (loadStatus === 'error') {
    return (
      <Layout title="Checklist Estado do Carro" showBack>
        <div className={styles.page}>
          <Card>
            <CardHeader>
              <CardTitle>Erro ao carregar veículo</CardTitle>
            </CardHeader>
            <p className={styles.errorMessage}>{loadError}</p>
            <Link to="/" className={styles.backLink}>
              Voltar ao início
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checklist Estado do Carro" showBack>
      <div className={styles.page}>
        <Card className={styles.vehicleCard}>
          <CardHeader>
            <CardTitle>Identificação do Veículo</CardTitle>
          </CardHeader>
          <VehicleForm vehicle={state.vehicle} onChange={handleVehicleChange} />
        </Card>

        <div className={styles.riskBar}>
          <span className={styles.riskLabel}>Estado geral:</span>
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
          <Link to="/loja/resumo" className={styles.primaryLink}>
            Ver resumo e gerar relatório
          </Link>
        </div>
      </div>
    </Layout>
  );
}

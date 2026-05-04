import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { SectionBlock } from '../../components/SectionBlock';
import { VehicleForm } from '../../components/VehicleForm';
import { getVehicleById, mapApiVehicleToIdentification } from '../../api/vehicles';
import { useLojaInspectionState } from '../../hooks/useLojaInspectionState';
import { filesToHighResDataUrls } from '../../utils/imageResizeDataUrl';
import styles from './ChecklistLojaPage.module.scss';

const TOPIC_PHOTOS_MAX = 8;

export function ChecklistLojaPage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const { state, updateVehicle, updateItemStatus, updateSectionTopicPhotos, startInspectionWithVehicle } =
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
        const msg = err instanceof Error ? err.message : 'Erro ao carregar veículo';
        const isNetworkOrCors = msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.includes('CORS');
        setLoadError(
          isNetworkOrCors
            ? 'Não foi possível acessar a API (rede ou CORS). Confira VITE_API_TOKEN no Vercel (Environment Variables) e se a API permite a origem deste app.'
            : msg
        );
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
              itemPhotosEnabled={false}
              topicPhotosEnabled
              topicPhotosMax={TOPIC_PHOTOS_MAX}
              onItemStatus={(itemId, status, observation) =>
                updateItemStatus(section.id, itemId, status, observation)
              }
              onTopicPhotosSelect={(files) => {
                const current = section.topicPhotos ?? [];
                const room = TOPIC_PHOTOS_MAX - current.length;
                if (room <= 0) return;
                filesToHighResDataUrls(files.slice(0, room), room).then((urls) => {
                  updateSectionTopicPhotos(section.id, [...current, ...urls].slice(0, TOPIC_PHOTOS_MAX));
                });
              }}
              onTopicPhotosChange={(photos) => updateSectionTopicPhotos(section.id, photos)}
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

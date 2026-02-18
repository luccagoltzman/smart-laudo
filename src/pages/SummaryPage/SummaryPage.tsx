import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { StatusBadge } from '../../components/StatusBadge';
import { useInspectionState } from '../../hooks/useInspectionState';
import type { ItemStatus } from '../../types/checklist.types';
import styles from './SummaryPage.module.scss';

export function SummaryPage() {
  const { state, startNewInspection } = useInspectionState();

  const countByStatus = (status: ItemStatus) =>
    state.sections.reduce(
      (acc, sec) => acc + sec.items.filter((i) => i.status === status).length,
      0
    );

  const approved = countByStatus('approved');
  const attention = countByStatus('attention');
  const rejected = countByStatus('rejected');
  const pending = countByStatus('pending');
  const total = state.sections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <Layout title="Resumo da Vistoria" showBack>
      <div className={styles.page}>
        <Card className={styles.riskCard}>
          <CardHeader>
            <CardTitle>Score de risco</CardTitle>
          </CardHeader>
          <div className={styles.riskBlock}>
            <RiskBadge level={state.riskLevel} score={state.riskScore} size="lg" />
            <p className={styles.riskHint}>
              {state.riskLevel === 'low' && 'Veículo em condições adequadas.'}
              {state.riskLevel === 'medium' && 'Revisar itens em atenção antes de concluir.'}
              {state.riskLevel === 'high' && 'Presença de itens críticos. Avaliar com cuidado.'}
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo por status</CardTitle>
          </CardHeader>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <StatusBadge status="approved" />
              <span>{approved} itens</span>
            </div>
            <div className={styles.stat}>
              <StatusBadge status="attention" />
              <span>{attention} itens</span>
            </div>
            <div className={styles.stat}>
              <StatusBadge status="rejected" />
              <span>{rejected} itens</span>
            </div>
            {pending > 0 && (
              <div className={styles.stat}>
                <StatusBadge status="pending" />
                <span>{pending} itens</span>
              </div>
            )}
          </div>
          <p className={styles.total}>Total: {total} itens vistoriados</p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Veículo</CardTitle>
          </CardHeader>
          <dl className={styles.vehicleList}>
            {state.vehicle.plate && (
              <>
                <dt>Placa</dt>
                <dd>{state.vehicle.plate}</dd>
              </>
            )}
            {state.vehicle.brand && (
              <>
                <dt>Marca / Modelo</dt>
                <dd>{[state.vehicle.brand, state.vehicle.model].filter(Boolean).join(' ')}</dd>
              </>
            )}
            {state.vehicle.year && (
              <>
                <dt>Ano</dt>
                <dd>{state.vehicle.year}</dd>
              </>
            )}
            {state.vehicle.km && (
              <>
                <dt>KM</dt>
                <dd>{state.vehicle.km}</dd>
              </>
            )}
          </dl>
        </Card>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            Continuar editando
          </Link>
          <Link to="/" className={styles.btnSecondary} onClick={startNewInspection}>
            Nova vistoria
          </Link>
        </div>

        <p className={styles.footer}>
          Em breve: geração de PDF, fotos anexadas, assinatura digital e QR Code de validação.
        </p>
      </div>
    </Layout>
  );
}

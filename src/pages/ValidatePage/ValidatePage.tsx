import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { loadReportForValidation } from '../../utils/generateLaudoPdf';
import styles from './ValidatePage.module.scss';

export function ValidatePage() {
  const { id } = useParams<{ id: string }>();
  const report = id ? loadReportForValidation(id) : null;

  if (!id || !report) {
    return (
      <Layout title="Validação de Laudo" showBack>
        <Card className={styles.card}>
          <div className={styles.notFound}>
            <span className={styles.notFoundIcon} aria-hidden>⚠️</span>
            <h2>Laudo não encontrado</h2>
            <p>O link pode estar incorreto ou o laudo pode ter sido removido deste dispositivo.</p>
            <Link to="/" className={styles.homeLink}>Ir para o início</Link>
          </div>
        </Card>
      </Layout>
    );
  }

  const date = new Date(report.createdAt).toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <Layout title="Laudo validado" showBack>
      <div className={styles.page}>
        <Card className={styles.validCard}>
          <div className={styles.validHeader}>
            <span className={styles.validIcon} aria-hidden>✓</span>
            <h2>Laudo válido</h2>
            <p>Este laudo foi emitido pelo Smart Laudo e pode ser conferido abaixo.</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Veículo</CardTitle>
          </CardHeader>
          <dl className={styles.vehicleList}>
            {report.vehicle.plate && (
              <>
                <dt>Placa</dt>
                <dd>{report.vehicle.plate}</dd>
              </>
            )}
            {report.vehicle.brand && (
              <>
                <dt>Marca / Modelo</dt>
                <dd>{[report.vehicle.brand, report.vehicle.model].filter(Boolean).join(' ')}</dd>
              </>
            )}
            {report.vehicle.year && (
              <>
                <dt>Ano</dt>
                <dd>{report.vehicle.year}</dd>
              </>
            )}
            {report.vehicle.km && (
              <>
                <dt>Quilometragem</dt>
                <dd>{report.vehicle.km}</dd>
              </>
            )}
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados da vistoria</CardTitle>
          </CardHeader>
          <dl className={styles.metaList}>
            <dt>Data e hora</dt>
            <dd>{date}</dd>
            <dt>ID do laudo</dt>
            <dd className={styles.mono}>{report.id}</dd>
            <dt>Nível de risco</dt>
            <dd>
              <RiskBadge level={report.riskLevel} score={report.riskScore} size="sm" />
            </dd>
          </dl>
        </Card>

        <p className={styles.footer}>
          A validação é feita com base nos dados armazenados neste dispositivo no momento da emissão do laudo.
        </p>
      </div>
    </Layout>
  );
}

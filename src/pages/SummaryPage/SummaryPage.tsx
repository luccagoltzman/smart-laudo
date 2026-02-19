import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { RiskBadge } from '../../components/RiskBadge';
import { SignaturePad } from '../../components/SignaturePad';
import { StatusBadge } from '../../components/StatusBadge';
import { useInspectionState } from '../../hooks/useInspectionState';
import type { ItemStatus } from '../../types/checklist.types';
import { generateLaudoPdf, saveReportForValidation } from '../../utils/generateLaudoPdf';
import styles from './SummaryPage.module.scss';

export function SummaryPage() {
  const { state, startNewInspection, setSignature } = useInspectionState();
  const [pdfLoading, setPdfLoading] = useState(false);
  const validationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/validar/${state.id}`;

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
            <CardTitle>Assinatura do vistoriador</CardTitle>
          </CardHeader>
          <SignaturePad value={state.signatureDataUrl} onChange={setSignature} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code de validação</CardTitle>
          </CardHeader>
          <p className={styles.qrHint}>
            O cliente pode escanear este QR Code para validar a autenticidade do laudo.
          </p>
          <div className={styles.qrWrap}>
            <QRCodeSVG value={validationUrl} size={160} level="M" aria-label="QR Code para validação do laudo" />
          </div>
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

        <button
          type="button"
          className={styles.btnPdf}
          disabled={pdfLoading}
          onClick={async () => {
            setPdfLoading(true);
            try {
              saveReportForValidation(state);
              await generateLaudoPdf(state, window.location.origin);
            } finally {
              setPdfLoading(false);
            }
          }}
        >
          {pdfLoading ? 'Gerando PDF…' : 'Gerar PDF do laudo'}
        </button>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            Continuar editando
          </Link>
          <Link to="/" className={styles.btnSecondary} onClick={startNewInspection}>
            Nova vistoria
          </Link>
        </div>
      </div>
    </Layout>
  );
}

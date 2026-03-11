import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/Card';
import { Layout } from '../../components/Layout';
import { useInspectionState } from '../../hooks/useInspectionState';
import { useLojaInspectionState } from '../../hooks/useLojaInspectionState';
import styles from './HomePage.module.scss';

export function HomePage() {
  const { state } = useInspectionState();
  const { state: stateLoja } = useLojaInspectionState();

  const totalItems = state.sections.reduce((acc, s) => acc + s.items.length, 0);
  const filledItems = state.sections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.status !== 'pending').length,
    0
  );
  const progress = totalItems > 0 ? Math.round((filledItems / totalItems) * 100) : 0;

  const totalLoja = stateLoja.sections.reduce((acc, s) => acc + s.items.length, 0);
  const filledLoja = stateLoja.sections.reduce(
    (acc, s) => acc + s.items.filter((i) => i.status !== 'pending').length,
    0
  );
  const progressLoja = totalLoja > 0 ? Math.round((filledLoja / totalLoja) * 100) : 0;

  return (
    <Layout>
      <div className={styles.page}>
        <Card>
          <CardHeader>
            <CardTitle>Laudo Cautelar</CardTitle>
          </CardHeader>
          <p className={styles.subtitle}>
            Checklist digital para vistoria veicular. Preencha a identificação do veículo e
            percorra todas as seções para gerar o laudo.
          </p>
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressText}>
              {filledItems} / {totalItems} itens
            </span>
          </div>
          <Link to="/checklist" className={styles.cta}>
            {progress === 0 ? 'Iniciar checklist' : 'Continuar checklist'}
          </Link>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Loja — Estado do Carro</CardTitle>
          </CardHeader>
          <p className={styles.subtitle}>
            Checklist rápido para lojas conferirem o estado do veículo na entrada ou na revenda.
          </p>
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressLoja}%` }} />
            </div>
            <span className={styles.progressText}>
              {filledLoja} / {totalLoja} itens
            </span>
          </div>
          <Link to="/loja/checklist" className={styles.ctaSecondary}>
            {progressLoja === 0 ? 'Iniciar checklist loja' : 'Continuar checklist loja'}
          </Link>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo rápido</CardTitle>
          </CardHeader>
          <ul className={styles.summaryList}>
            <li>Identificação do veículo</li>
            <li>Documentação (CRLV, restrições, débitos)</li>
            <li>Estrutura e carroceria</li>
            <li>Pintura e vidros</li>
            <li>Etiquetas e VIN</li>
            <li>Motor e itens de segurança</li>
            <li>Testes funcionais e rodagem</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
}

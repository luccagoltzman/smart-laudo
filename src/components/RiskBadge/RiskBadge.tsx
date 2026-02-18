import { RISK_LEVEL_LABEL, type RiskLevel } from '../../types/checklist.types';
import styles from './RiskBadge.module.scss';

export interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, score, size = 'md' }: RiskBadgeProps) {
  return (
    <div className={`${styles.wrapper} ${styles[level]} ${styles[size]}`} role="status">
      <span className={styles.dot} aria-hidden />
      <span className={styles.label}>{RISK_LEVEL_LABEL[level]}</span>
      {score !== undefined && (
        <span className={styles.score}>Score: {score}</span>
      )}
    </div>
  );
}

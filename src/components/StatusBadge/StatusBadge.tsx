import { ITEM_STATUS_LABEL, type ItemStatus } from '../../types/checklist.types';
import styles from './StatusBadge.module.scss';

export interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]} ${styles[size]}`} role="status">
      {ITEM_STATUS_LABEL[status]}
    </span>
  );
}

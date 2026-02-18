import { useState } from 'react';
import type { ItemStatus } from '../../types/checklist.types';
import { Button } from '../Button';
import { PhotoUpload } from '../PhotoUpload';
import { StatusBadge } from '../StatusBadge';
import styles from './ChecklistItemRow.module.scss';

export interface ChecklistItemRowProps {
  itemId: string;
  label: string;
  status: ItemStatus;
  observation?: string;
  onStatusChange: (status: ItemStatus) => void;
  onObservationChange?: (value: string) => void;
  onPhotosSelect?: (files: File[]) => void;
}

const STATUS_OPTIONS: ItemStatus[] = ['approved', 'attention', 'rejected'];

export function ChecklistItemRow({
  label,
  status,
  observation = '',
  onStatusChange,
  onObservationChange,
  onPhotosSelect,
}: ChecklistItemRowProps) {
  const [showObs, setShowObs] = useState(!!observation);
  const [obsValue, setObsValue] = useState(observation);

  const handleObsBlur = () => {
    onObservationChange?.(obsValue.trim());
  };

  return (
    <div className={styles.row}>
      <div className={styles.labelBlock}>
        <span className={styles.label}>{label}</span>
        <StatusBadge status={status} size="sm" />
      </div>

      <div className={styles.actions} role="group" aria-label={`Status para ${label}`}>
        {STATUS_OPTIONS.map((s) => (
          <Button
            key={s}
            type="button"
            variant={status === s ? (s === 'approved' ? 'primary' : s === 'attention' ? 'secondary' : 'danger') : 'ghost'}
            size="sm"
            className={styles.statusBtn}
            onClick={() => onStatusChange(s)}
          >
            {s === 'approved' ? '✓' : s === 'attention' ? '!' : '✕'}
          </Button>
        ))}
      </div>

      {onObservationChange && (
        <>
          {!showObs ? (
            <button
              type="button"
              className={styles.obsToggle}
              onClick={() => setShowObs(true)}
            >
              + Observação
            </button>
          ) : (
            <div className={styles.obsBlock}>
              <textarea
                className={styles.obsInput}
                placeholder="Observação (opcional)"
                value={obsValue}
                onChange={(e) => setObsValue(e.target.value)}
                onBlur={handleObsBlur}
                rows={2}
                aria-label="Observação"
              />
              <button
                type="button"
                className={styles.obsClose}
                onClick={() => {
                  setShowObs(false);
                  setObsValue('');
                  onObservationChange('');
                }}
              >
                Remover
              </button>
            </div>
          )}
        </>
      )}

      {onPhotosSelect && (
        <div className={styles.photoBlock}>
          <PhotoUpload label="Foto" onSelect={onPhotosSelect} maxFiles={2} />
        </div>
      )}
    </div>
  );
}

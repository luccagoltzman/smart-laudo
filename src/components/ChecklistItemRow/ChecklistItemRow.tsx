import { useEffect, useState } from 'react';
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
  photos?: string[];
  onStatusChange: (status: ItemStatus) => void;
  onObservationChange?: (value: string) => void;
  onPhotosSelect?: (files: File[]) => void;
  onPhotosChange?: (photos: string[]) => void;
  /** Se false, não exibe upload de fotos por item (ex.: checklist loja). Padrão: true. */
  photosEnabled?: boolean;
  /** Se true, fotos ficam atrás de “+ Fotos” até o usuário abrir (menos atrito no preenchimento). Padrão: true. */
  photosCollapsedByDefault?: boolean;
}

const STATUS_OPTIONS: ItemStatus[] = ['approved', 'attention', 'rejected'];

export function ChecklistItemRow({
  label,
  status,
  observation = '',
  onStatusChange,
  onObservationChange,
  photos = [],
  onPhotosSelect,
  onPhotosChange,
  photosEnabled = true,
  photosCollapsedByDefault = true,
}: ChecklistItemRowProps) {
  const [showObs, setShowObs] = useState(!!observation);
  const [obsValue, setObsValue] = useState(observation);
  const [showPhotoPanel, setShowPhotoPanel] = useState(
    () => !photosCollapsedByDefault || (photos?.length ?? 0) > 0
  );

  useEffect(() => {
    if ((photos?.length ?? 0) > 0) setShowPhotoPanel(true);
  }, [photos?.length]);

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

      {photosEnabled && (onPhotosSelect || onPhotosChange) && (
        <div className={styles.photoBlock}>
          {!showPhotoPanel ? (
            <button
              type="button"
              className={styles.photoToggle}
              onClick={() => setShowPhotoPanel(true)}
            >
              + Fotos (opcional)
            </button>
          ) : (
            <>
              {photos.length > 0 && (
                <div className={styles.thumbnails}>
                  {photos.map((dataUrl, index) => (
                    <div key={index} className={styles.thumbWrap}>
                      <img src={dataUrl} alt="" className={styles.thumb} />
                      {onPhotosChange && (
                        <button
                          type="button"
                          className={styles.thumbRemove}
                          onClick={() => onPhotosChange(photos.filter((_, i) => i !== index))}
                          aria-label="Remover foto"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {onPhotosSelect && photos.length < 4 && (
                <PhotoUpload label="Adicionar foto" onSelect={onPhotosSelect} maxFiles={4 - photos.length} />
              )}
              {photosCollapsedByDefault && photos.length === 0 && (
                <button
                  type="button"
                  className={styles.photoClose}
                  onClick={() => setShowPhotoPanel(false)}
                >
                  Ocultar fotos
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

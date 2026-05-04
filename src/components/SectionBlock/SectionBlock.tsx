import type { ChecklistSection } from '../../types/checklist.types';
import { Card, CardHeader, CardTitle } from '../Card';
import { ChecklistItemRow } from '../ChecklistItemRow';
import { PhotoUpload } from '../PhotoUpload';
import styles from './SectionBlock.module.scss';

export interface SectionBlockProps {
  section: ChecklistSection;
  onItemStatus: (itemId: string, status: ChecklistSection['items'][0]['status'], observation?: string) => void;
  onItemPhoto?: (itemId: string, files: File[]) => void;
  onItemPhotosChange?: (itemId: string, photos: string[]) => void;
  /** Se false, não mostra fotos por item (checklist rápido). Padrão: true. */
  itemPhotosEnabled?: boolean;
  /** Se true, fotos por item começam recolhidas (“+ Fotos”). Padrão: true. */
  photosCollapsedByDefault?: boolean;
  /** Fotos agrupadas por tópico (fim da seção). Ex.: checklist loja. */
  topicPhotosEnabled?: boolean;
  topicPhotosMax?: number;
  onTopicPhotosSelect?: (files: File[]) => void;
  onTopicPhotosChange?: (photos: string[]) => void;
}

export function SectionBlock({
  section,
  onItemStatus,
  onItemPhoto,
  onItemPhotosChange,
  itemPhotosEnabled = true,
  photosCollapsedByDefault = true,
  topicPhotosEnabled = false,
  topicPhotosMax = 8,
  onTopicPhotosSelect,
  onTopicPhotosChange,
}: SectionBlockProps) {
  const topicPhotos = section.topicPhotos ?? [];
  const topicRoom = Math.max(0, topicPhotosMax - topicPhotos.length);

  return (
    <Card className={styles.section} padding="none">
      <CardHeader className={styles.header}>
        <span className={styles.icon} aria-hidden>
          {section.icon}
        </span>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <div className={styles.content}>
        {section.items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            itemId={item.id}
            label={item.label}
            status={item.status}
            observation={item.observation}
            photos={item.photos}
            onStatusChange={(status) => onItemStatus(item.id, status)}
            onObservationChange={(observation) => onItemStatus(item.id, item.status, observation)}
            onPhotosSelect={itemPhotosEnabled && onItemPhoto ? (files) => onItemPhoto(item.id, files) : undefined}
            onPhotosChange={
              itemPhotosEnabled && onItemPhotosChange ? (photos) => onItemPhotosChange(item.id, photos) : undefined
            }
            photosEnabled={itemPhotosEnabled}
            photosCollapsedByDefault={photosCollapsedByDefault}
          />
        ))}
      </div>

      {topicPhotosEnabled && (onTopicPhotosSelect || onTopicPhotosChange) && (
        <div className={styles.topicPhotos}>
          <p className={styles.topicPhotosTitle}>Fotos deste tópico</p>
          <p className={styles.topicPhotosHint}>
            Após preencher os itens, adicione fotos deste grupo (até {topicPhotosMax}). Elas saem grandes no PDF.
          </p>
          {topicPhotos.length > 0 && (
            <div className={styles.topicThumbnails}>
              {topicPhotos.map((dataUrl, index) => (
                <div key={index} className={styles.topicThumbWrap}>
                  <img src={dataUrl} alt="" className={styles.topicThumb} />
                  {onTopicPhotosChange && (
                    <button
                      type="button"
                      className={styles.topicThumbRemove}
                      onClick={() => onTopicPhotosChange(topicPhotos.filter((_, i) => i !== index))}
                      aria-label="Remover foto"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {onTopicPhotosSelect && topicRoom > 0 && (
            <PhotoUpload
              label="Adicionar fotos ao tópico"
              onSelect={onTopicPhotosSelect}
              maxFiles={topicRoom}
            />
          )}
        </div>
      )}
    </Card>
  );
}

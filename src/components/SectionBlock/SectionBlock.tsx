import type { ChecklistSection } from '../../types/checklist.types';
import { Card, CardHeader, CardTitle } from '../Card';
import { ChecklistItemRow } from '../ChecklistItemRow';
import styles from './SectionBlock.module.scss';

export interface SectionBlockProps {
  section: ChecklistSection;
  onItemStatus: (itemId: string, status: ChecklistSection['items'][0]['status'], observation?: string) => void;
  onItemPhoto?: (itemId: string, files: File[]) => void;
}

export function SectionBlock({ section, onItemStatus, onItemPhoto }: SectionBlockProps) {
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
            onStatusChange={(status) => onItemStatus(item.id, status)}
            onObservationChange={(observation) => onItemStatus(item.id, item.status, observation)}
            onPhotosSelect={onItemPhoto ? (files) => onItemPhoto(item.id, files) : undefined}
          />
        ))}
      </div>
    </Card>
  );
}

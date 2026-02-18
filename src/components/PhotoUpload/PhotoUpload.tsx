import { useRef } from 'react';
import styles from './PhotoUpload.module.scss';

export interface PhotoUploadProps {
  onSelect?: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  label?: string;
}

export function PhotoUpload({
  onSelect,
  maxFiles = 4,
  disabled,
  label = 'Adicionar foto',
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length && onSelect) {
      onSelect(files.slice(0, maxFiles));
    }
    e.target.value = '';
  };

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className={styles.input}
        onChange={handleChange}
        disabled={disabled}
        aria-label={label}
      />
      <button
        type="button"
        className={styles.trigger}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        <span className={styles.icon} aria-hidden>📷</span>
        <span>{label}</span>
      </button>
    </div>
  );
}

import type { VehicleIdentification } from '../../types/checklist.types';
import styles from './VehicleForm.module.scss';

export interface VehicleFormProps {
  vehicle: VehicleIdentification;
  onChange: (field: keyof VehicleIdentification, value: string) => void;
}

const FIELDS: { key: keyof VehicleIdentification; label: string; placeholder: string; type?: string }[] = [
  { key: 'plate', label: 'Placa', placeholder: 'ABC-1D23' },
  { key: 'renavam', label: 'Renavam', placeholder: 'Número do Renavam' },
  { key: 'chassi', label: 'Chassi (VIN)', placeholder: '17 caracteres' },
  { key: 'brand', label: 'Marca', placeholder: 'Ex: Volkswagen' },
  { key: 'model', label: 'Modelo', placeholder: 'Ex: Gol' },
  { key: 'year', label: 'Ano', placeholder: 'Ex: 2022' },
  { key: 'version', label: 'Versão', placeholder: 'Ex: 1.0 MSI' },
  { key: 'color', label: 'Cor', placeholder: 'Ex: Branco' },
  { key: 'km', label: 'KM atual', placeholder: 'Ex: 45000', type: 'number' },
];

export function VehicleForm({ vehicle, onChange }: VehicleFormProps) {
  return (
    <div className={styles.grid}>
      {FIELDS.map(({ key, label, placeholder, type = 'text' }) => (
        <div key={key} className={styles.field}>
          <label htmlFor={key} className={styles.label}>
            {label}
          </label>
          <input
            id={key}
            type={type}
            inputMode={type === 'number' ? 'numeric' : 'text'}
            className={styles.input}
            placeholder={placeholder}
            value={vehicle[key]}
            onChange={(e) => onChange(key, e.target.value)}
            aria-label={label}
          />
        </div>
      ))}
    </div>
  );
}

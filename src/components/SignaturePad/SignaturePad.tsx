import { useRef, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../Button';
import styles from './SignaturePad.module.scss';

interface SignaturePadHandle {
  getCanvas(): HTMLCanvasElement;
  clear(): void;
  isEmpty(): boolean;
}

export interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  disabled?: boolean;
}

export function SignaturePad({ value, onChange, disabled }: SignaturePadProps) {
  const padRef = useRef<SignaturePadHandle | null>(null);

  const clear = useCallback(() => {
    padRef.current?.clear();
    onChange(undefined);
  }, [onChange]);

  const save = useCallback(() => {
    const canvas = padRef.current?.getCanvas();
    if (!canvas) return;
    const isEmpty = padRef.current?.isEmpty();
    if (isEmpty) {
      onChange(undefined);
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
  }, [onChange]);


  return (
    <div className={styles.wrapper}>
      <div className={styles.padWrap}>
        <SignatureCanvas
          ref={padRef as unknown as React.LegacyRef<InstanceType<typeof SignatureCanvas>>}
          canvasProps={{
            className: styles.pad,
            'aria-label': 'Área de assinatura',
          }}
          backgroundColor="white"
          penColor="#1a1a1a"
          minWidth={1}
          maxWidth={2}
          throttle={16}
          disabled={disabled}
        />
      </div>
      <p className={styles.hint}>Assine no quadro acima usando o dedo ou o mouse.</p>
      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={clear}>
          Limpar
        </Button>
        <Button type="button" variant="primary" size="md" onClick={save}>
          Confirmar assinatura
        </Button>
      </div>
      {value && (
        <div className={styles.preview}>
          <p className={styles.previewLabel}>Assinatura registrada:</p>
          <img src={value} alt="Assinatura" className={styles.previewImg} />
        </div>
      )}
    </div>
  );
}

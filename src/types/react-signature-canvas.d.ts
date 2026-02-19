declare module 'react-signature-canvas' {
  import type { ComponentClass } from 'react';

  export interface SignatureCanvasProps {
    canvasProps?: Record<string, unknown>;
    backgroundColor?: string;
    penColor?: string;
    minWidth?: number;
    maxWidth?: number;
    throttle?: number;
    disabled?: boolean;
  }

  const SignatureCanvas: ComponentClass<SignatureCanvasProps>;
  export default SignatureCanvas;
}

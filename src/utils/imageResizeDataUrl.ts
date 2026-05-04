import { fileToDataUrl } from './fileToDataUrl';

/**
 * Redimensiona imagem para até `maxEdge` no maior lado (mantém proporção) e exporta JPEG.
 * Melhora nitidez no PDF sem estourar localStorage com fotos de 12MP brutas.
 */
export async function fileToHighResDataUrl(
  file: File,
  maxEdge = 2000,
  quality = 0.9
): Promise<string> {
  try {
    const bmp = await createImageBitmap(file);
    const w = bmp.width;
    const h = bmp.height;
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));
    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bmp.close();
      return fileToDataUrl(file);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, cw, ch);
    bmp.close();
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    return fileToDataUrl(file);
  }
}

export async function filesToHighResDataUrls(files: File[], maxCount: number, maxEdge = 2000): Promise<string[]> {
  const limited = files.slice(0, maxCount);
  return Promise.all(limited.map((f) => fileToHighResDataUrl(f, maxEdge)));
}

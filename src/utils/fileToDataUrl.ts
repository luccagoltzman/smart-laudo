/**
 * Converte um File em data URL (base64) para armazenar e exibir no laudo
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function filesToDataUrls(files: File[], maxCount = 4): Promise<string[]> {
  const limited = files.slice(0, maxCount);
  return Promise.all(limited.map(fileToDataUrl));
}

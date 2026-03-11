import type { VehicleIdentification } from '../types/checklist.types';
import type { VehicleApiResponse } from '../types/vehicleApi.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.carmanager.com.br';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

/**
 * Converte a resposta da API (Car Manager) para VehicleIdentification do checklist.
 */
export function mapApiVehicleToIdentification(api: VehicleApiResponse): VehicleIdentification {
  return {
    plate: api.plate ?? '',
    renavam: '',
    chassi: api.chassis ?? '',
    brand: api.brand ?? '',
    model: api.model ?? '',
    year: api.year ? String(api.year) : '',
    version: api.notes ?? '',
    color: api.color ?? '',
    km: api.km ?? '',
  };
}

/**
 * Busca um veículo pelo ID na API.
 * GET {API_BASE_URL}/api/vehicles/:id
 * Usa redirect: 'manual' para não seguir redirect para /login (evita erro de CORS).
 * Se VITE_API_TOKEN estiver definido, envia Authorization: Bearer <token>.
 */
export async function getVehicleById(id: string | number): Promise<VehicleApiResponse> {
  const url = `${API_BASE_URL}/api/vehicles/${id}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  };
  const res = await fetch(url, { headers, redirect: 'manual' });

  const isRedirect = res.type === 'opaqueredirect' || res.status === 302 || res.status === 301 || res.status === 0;
  if (isRedirect) {
    throw new Error(
      'A API redirecionou para login (não autorizado) ou a resposta foi bloqueada. Verifique: 1) VITE_API_TOKEN está definido (no Vercel: Settings → Environment Variables); 2) o token está correto e não expirou; 3) a API permite a origem do app (CORS).'
    );
  }

  if (res.status === 401) {
    throw new Error(
      'Token inválido ou expirado. Atualize VITE_API_TOKEN no .env (local) ou nas variáveis de ambiente do Vercel.'
    );
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ao buscar veículo: ${res.status}`);
  }

  return res.json() as Promise<VehicleApiResponse>;
}

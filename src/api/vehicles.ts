import type { VehicleIdentification } from '../types/checklist.types';
import type { VehicleApiResponse } from '../types/vehicleApi.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.carmanager.com.br';

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
 */
export async function getVehicleById(id: string | number): Promise<VehicleApiResponse> {
  const url = `${API_BASE_URL}/api/vehicles/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ao buscar veículo: ${res.status}`);
  }

  return res.json() as Promise<VehicleApiResponse>;
}

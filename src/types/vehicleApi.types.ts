/**
 * Tipos da API Car Manager para veículos.
 * GET https://api.carmanager.com.br/api/vehicles/:id
 */

export interface VehicleExpense {
  id: number;
  vehicle_id: number;
  type: string;
  description: string;
  amount: number;
  expense_date: string;
  category: string;
  status: string;
}

export interface VehicleImage {
  id: number;
  vehicle_id: number;
  url: string;
}

export interface VehicleApiResponse {
  id: number;
  company_id: number;
  brand: string;
  model: string;
  year: string;
  color: string;
  plate: string;
  chassis: string;
  purchase_price: number;
  notes: string | null;
  status: string;
  purchase_date: string | null;
  codigo_fipe: string | null;
  codigo_ano: string | null;
  vehicleType: string | null;
  km: string | null;
  motor: string | null;
  cambio: string | null;
  is_consignado: boolean;
  sale_price: number | null;
  sale_price_promo: number | null;
  expenses: VehicleExpense[];
  images: VehicleImage[];
  documents: unknown[];
  sale: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Status de cada item ou seção do laudo
 */
export type ItemStatus = 'approved' | 'attention' | 'rejected' | 'pending';

/**
 * Nível de risco do veículo (score final)
 */
export type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Item individual do checklist (pergunta sim/não ou observação)
 */
export interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
  observation?: string;
  photoIds?: string[];
}

/**
 * Seção do checklist (ex: Identificação, Documentação, Estrutura)
 */
export interface ChecklistSection {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

/**
 * Dados de identificação do veículo
 */
export interface VehicleIdentification {
  plate: string;
  renavam: string;
  chassi: string;
  brand: string;
  model: string;
  year: string;
  version: string;
  color: string;
  km: string;
}

/**
 * Resposta do checklist completo (estado da vistoria)
 */
export interface InspectionState {
  id: string;
  createdAt: string;
  vehicle: VehicleIdentification;
  sections: ChecklistSection[];
  riskLevel: RiskLevel;
  riskScore: number;
  summaryNotes?: string;
}

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  approved: 'Aprovado',
  attention: 'Atenção',
  rejected: 'Reprovado',
  pending: 'Pendente',
};

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  low: 'Baixo risco',
  medium: 'Atenção',
  high: 'Alto risco',
};

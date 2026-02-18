import type { ItemStatus, RiskLevel } from '../types/checklist.types';

const STATUS_WEIGHT: Record<ItemStatus, number> = {
  approved: 0,
  attention: 1,
  rejected: 2,
  pending: 0.5,
};

/**
 * Calcula score de risco (0–100) com base nos status dos itens.
 * Quanto maior o score, maior o risco.
 */
export function calculateRiskScore(sections: { items: { status: ItemStatus }[] }[]): number {
  let total = 0;
  let count = 0;
  for (const section of sections) {
    for (const item of section.items) {
      total += STATUS_WEIGHT[item.status];
      count += 1;
    }
  }
  if (count === 0) return 0;
  const average = total / count;
  return Math.min(100, Math.round(average * 50));
}

/**
 * Define o nível de risco a partir do score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

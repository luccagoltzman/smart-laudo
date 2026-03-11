import type { ChecklistSection } from '../types/checklist.types';

type PendingItem = { id: string; label: string; status: 'pending' };

const createItem = (id: string, label: string): PendingItem => ({
  id,
  label,
  status: 'pending',
});

type SectionTemplate = Omit<ChecklistSection, 'items'> & { items: PendingItem[] };

/**
 * Checklist rápido para lojas de carros — estado geral do veículo.
 * Focado em itens práticos para avaliação na revenda.
 */
export const CHECKLIST_LOJA_SECTIONS: SectionTemplate[] = [
  {
    id: 'identificacao',
    title: 'Identificação',
    icon: '🚗',
    items: [
      createItem('id-placa', 'Placa'),
      createItem('id-marca-modelo', 'Marca / Modelo'),
      createItem('id-ano', 'Ano'),
      createItem('id-cor', 'Cor'),
      createItem('id-km', 'KM atual'),
    ],
  },
  {
    id: 'exterior',
    title: 'Exterior',
    icon: '🚙',
    items: [
      createItem('ext-lataria', 'Lataria sem amassados graves'),
      createItem('ext-pintura', 'Pintura em bom estado'),
      createItem('ext-vidros', 'Vidros íntegros (sem trincas)'),
      createItem('ext-farois', 'Faróis e lanternas funcionando'),
      createItem('ext-parachoque', 'Para-choques e calotas'),
    ],
  },
  {
    id: 'interior',
    title: 'Interior',
    icon: '🪑',
    items: [
      createItem('int-estofados', 'Estofados em bom estado'),
      createItem('int-painel', 'Painel e comandos'),
      createItem('int-tapetes', 'Tapetes e acabamento'),
      createItem('int-limpeza', 'Limpeza e odor'),
    ],
  },
  {
    id: 'mecanica',
    title: 'Mecânica',
    icon: '⚙️',
    items: [
      createItem('mec-motor', 'Motor sem barulhos estranhos'),
      createItem('mec-oleo', 'Nível de óleo'),
      createItem('mec-fluidos', 'Fluídos (freio, direção, arrefecimento)'),
      createItem('mec-bateria', 'Bateria e partida'),
    ],
  },
  {
    id: 'documentacao',
    title: 'Documentação',
    icon: '📄',
    items: [
      createItem('doc-crlv', 'CRLV em dia'),
      createItem('doc-chave', 'Chave reserva'),
      createItem('doc-manual', 'Manual do proprietário'),
    ],
  },
  {
    id: 'pneus-freios',
    title: 'Pneus e Freios',
    icon: '🛞',
    items: [
      createItem('pf-desgaste', 'Desgaste dos pneus'),
      createItem('pf-estepe', 'Estepe e kit'),
      createItem('pf-freios', 'Freios (pedal, discos/pastilhas)'),
    ],
  },
];

/** Converte para ChecklistSection com tipo completo (status + observation + photos) */
export function getInitialLojaSections(): ChecklistSection[] {
  return CHECKLIST_LOJA_SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.map((item) => ({
      ...item,
      status: item.status as ChecklistSection['items'][0]['status'],
      observation: undefined,
      photos: [],
    })),
  }));
}

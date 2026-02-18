import type { ChecklistSection } from '../types/checklist.types';

const createItem = (id: string, label: string): { id: string; label: string; status: 'pending' as const; photoIds?: string[] } => ({
  id,
  label,
  status: 'pending',
});

export const CHECKLIST_SECTIONS: Omit<ChecklistSection, 'items'> & { items: Array<{ id: string; label: string; status: 'pending' }> }[] = [
  {
    id: 'identificacao',
    title: 'Identificação do Veículo',
    icon: '🚗',
    items: [
      createItem('id-placa', 'Placa'),
      createItem('id-renavam', 'Renavam'),
      createItem('id-chassi', 'Chassi (VIN)'),
      createItem('id-marca-modelo', 'Marca / Modelo'),
      createItem('id-ano-versao', 'Ano / Versão'),
      createItem('id-cor', 'Cor'),
      createItem('id-km', 'KM atual'),
    ],
  },
  {
    id: 'documentacao',
    title: 'Documentação',
    icon: '📄',
    items: [
      createItem('doc-crlv', 'CRLV apresentado'),
      createItem('doc-dados', 'Dados conferem?'),
      createItem('doc-restricoes', 'Restrições administrativas'),
      createItem('doc-alienacao', 'Alienação'),
      createItem('doc-leilao', 'Histórico de leilão'),
      createItem('doc-debitos', 'Débitos'),
    ],
  },
  {
    id: 'estrutura',
    title: 'Estrutura / Carroceria',
    icon: '🔧',
    items: [
      createItem('estr-longarinas', 'Longarinas'),
      createItem('estr-colunas', 'Colunas'),
      createItem('estr-paineis', 'Painéis laterais'),
      createItem('estr-teto', 'Teto'),
      createItem('estr-assoalho', 'Assoalho'),
      createItem('estr-soldas', 'Soldas originais?'),
      createItem('estr-reparo', 'Sinais de reparo?'),
      createItem('estr-desalinhamento', 'Desalinhamentos?'),
    ],
  },
  {
    id: 'pintura',
    title: 'Pintura',
    icon: '🎨',
    items: [
      createItem('pint-tonalidade', 'Diferença de tonalidade'),
      createItem('pint-casca', 'Casca de laranja'),
      createItem('pint-overspray', 'Overspray'),
      createItem('pint-espessura', 'Espessura irregular'),
      createItem('pint-repintura', 'Indícios de repintura'),
    ],
  },
  {
    id: 'vidros',
    title: 'Vidros',
    icon: '🪟',
    items: [
      createItem('vid-originais', 'Originais?'),
      createItem('vid-marcacao', 'Marcação compatível com ano?'),
      createItem('vid-trinco-riscos', 'Trincas / riscos'),
    ],
  },
  {
    id: 'etiquetas-vin',
    title: 'Etiquetas / VIN',
    icon: '🏷️',
    items: [
      createItem('vin-etiqueta-chassi', 'Etiqueta do chassi'),
      createItem('vin-etiquetas-fabrica', 'Etiquetas de fábrica'),
      createItem('vin-remarcacao', 'Indícios de remarcação'),
    ],
  },
  {
    id: 'motor',
    title: 'Motor / Compartimento',
    icon: '⚙️',
    items: [
      createItem('mot-numero', 'Número do motor'),
      createItem('mot-vazamentos', 'Vazamentos'),
      createItem('mot-oxidacao', 'Oxidação'),
      createItem('mot-enchente', 'Sinais de enchente'),
      createItem('mot-parafusos', 'Parafusos mexidos'),
    ],
  },
  {
    id: 'seguranca',
    title: 'Itens de Segurança',
    icon: '🛡️',
    items: [
      createItem('seg-airbags', 'Airbags'),
      createItem('seg-abs', 'ABS'),
      createItem('seg-luzes', 'Luzes de alerta'),
      createItem('seg-cintos', 'Cintos'),
    ],
  },
  {
    id: 'testes-funcionais',
    title: 'Testes Funcionais',
    icon: '✅',
    items: [
      createItem('func-iluminacao', 'Iluminação'),
      createItem('func-painel', 'Painel'),
      createItem('func-ar', 'Ar-condicionado'),
      createItem('func-vidros', 'Vidros elétricos'),
      createItem('func-travamento', 'Travamento'),
    ],
  },
  {
    id: 'rodagem',
    title: 'Rodagem / Suspensão',
    icon: '🛞',
    items: [
      createItem('rod-pneus', 'Pneus'),
      createItem('rod-desgaste', 'Desgaste irregular'),
      createItem('rod-amortecedores', 'Amortecedores'),
      createItem('rod-ruidos', 'Ruídos'),
    ],
  },
];

/** Converte para ChecklistSection com tipo completo (status + observation) */
export function getInitialSections(): ChecklistSection[] {
  return CHECKLIST_SECTIONS.map((sec) => ({
    ...sec,
    items: sec.items.map((item) => ({
      ...item,
      status: item.status as ChecklistSection['items'][0]['status'],
      observation: undefined,
      photoIds: [],
    })),
  }));
}

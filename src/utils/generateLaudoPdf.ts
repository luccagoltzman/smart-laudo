import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { InspectionState } from '../types/checklist.types';
import { ITEM_STATUS_LABEL, RISK_LEVEL_LABEL } from '../types/checklist.types';

const REPORT_STORAGE_PREFIX = 'smart-laudo-report-';

/** Salva cópia do laudo para a página de validação (QR Code) */
export function saveReportForValidation(state: InspectionState): void {
  try {
    localStorage.setItem(`${REPORT_STORAGE_PREFIX}${state.id}`, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/** Carrega laudo salvo para validação por ID */
export function loadReportForValidation(id: string): InspectionState | null {
  try {
    const raw = localStorage.getItem(`${REPORT_STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as InspectionState;
  } catch {
    return null;
  }
}

const MARGIN = 20;
const PAGE_W = 210;
const PAGE_H = 297;
const LINE_HEIGHT = 6;
const FONT_SIZE_NORMAL = 10;
const FONT_SIZE_TITLE = 16;
const FONT_SIZE_SECTION = 12;
const IMG_SIZE = 25;
const IMG_GAP = 4;

function getStatusText(status: InspectionState['sections'][0]['items'][0]['status']): string {
  return ITEM_STATUS_LABEL[status];
}

export async function generateLaudoPdf(
  state: InspectionState,
  validationBaseUrl: string
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const text = (str: string, fontSize = FONT_SIZE_NORMAL) => {
    addPageIfNeeded(LINE_HEIGHT);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(str, PAGE_W - 2 * MARGIN);
    doc.text(lines, MARGIN, y);
    y += lines.length * LINE_HEIGHT;
  };

  const blank = (h = LINE_HEIGHT) => {
    y += h;
    if (y > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // Título
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.text('LAUDO CAUTELAR DE VISTORIA VEICULAR', PAGE_W / 2, y, { align: 'center' });
  y += LINE_HEIGHT * 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_NORMAL);
  text(`Data da vistoria: ${new Date(state.createdAt).toLocaleString('pt-BR')}`);
  text(`ID do laudo: ${state.id}`);
  text(`Risco: ${RISK_LEVEL_LABEL[state.riskLevel]} (Score: ${state.riskScore})`);
  blank(LINE_HEIGHT);

  // Veículo
  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont('helvetica', 'bold');
  text('1. IDENTIFICAÇÃO DO VEÍCULO');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_NORMAL);
  const v = state.vehicle;
  if (v.plate) text(`Placa: ${v.plate}`);
  if (v.renavam) text(`Renavam: ${v.renavam}`);
  if (v.chassi) text(`Chassi: ${v.chassi}`);
  if (v.brand || v.model) text(`Marca/Modelo: ${[v.brand, v.model].filter(Boolean).join(' ')}`);
  if (v.year) text(`Ano: ${v.year}`);
  if (v.version) text(`Versão: ${v.version}`);
  if (v.color) text(`Cor: ${v.color}`);
  if (v.km) text(`Quilometragem: ${v.km}`);
  blank(LINE_HEIGHT);

  // Seções
  doc.setFontSize(FONT_SIZE_SECTION);
  doc.setFont('helvetica', 'bold');
  let sectionNum = 2;
  for (const section of state.sections) {
    addPageIfNeeded(LINE_HEIGHT * 4);
    text(`${sectionNum}. ${section.title.toUpperCase()}`);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT_SIZE_NORMAL);
    for (const item of section.items) {
      addPageIfNeeded(LINE_HEIGHT * 3 + (item.photos?.length ? IMG_SIZE + LINE_HEIGHT : 0));
      const statusStr = getStatusText(item.status);
      text(`• ${item.label}: ${statusStr}`);
      if (item.observation) {
        doc.setFont('helvetica', 'italic');
        text(`  Obs: ${item.observation}`, 9);
        doc.setFont('helvetica', 'normal');
      }
      if (item.photos?.length) {
        let xImg = MARGIN + 5;
        for (let i = 0; i < item.photos.length; i++) {
          const dataUrl = item.photos[i];
          if (xImg + IMG_SIZE > PAGE_W - MARGIN) {
            xImg = MARGIN + 5;
            y += IMG_SIZE + IMG_GAP;
            addPageIfNeeded(IMG_SIZE + LINE_HEIGHT);
          }
          try {
            const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(dataUrl, format, xImg, y, IMG_SIZE, IMG_SIZE);
          } catch {
            // skip image if invalid
          }
          xImg += IMG_SIZE + IMG_GAP;
        }
        y += IMG_SIZE + IMG_GAP;
      }
    }
    blank(LINE_HEIGHT * 0.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT_SIZE_SECTION);
    sectionNum += 1;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_NORMAL);
  blank(LINE_HEIGHT);

  // Assinatura
  if (state.signatureDataUrl) {
    addPageIfNeeded(40);
    doc.setFont('helvetica', 'bold');
    text('Assinatura do vistoriador');
    doc.setFont('helvetica', 'normal');
    try {
      doc.addImage(state.signatureDataUrl, 'PNG', MARGIN, y, 60, 25);
    } catch {
      text('[Assinatura não renderizada]');
    }
    y += 30;
  }

  // QR Code para validação
  const validationUrl = `${validationBaseUrl}/validar/${state.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(validationUrl, { width: 120, margin: 1 });
    addPageIfNeeded(45);
    doc.setFont('helvetica', 'bold');
    text('Validação do laudo');
    doc.setFont('helvetica', 'normal');
    text('Escaneie o QR Code abaixo para validar a autenticidade deste laudo.');
    doc.addImage(qrDataUrl, 'PNG', MARGIN, y, 35, 35);
    doc.setFontSize(8);
    doc.text(validationUrl, MARGIN + 40, y + 20);
    doc.setFontSize(FONT_SIZE_NORMAL);
  } catch {
    text(`Valide este laudo em: ${validationUrl}`);
  }

  doc.save(`laudo-cautelar-${state.vehicle.plate || state.id.slice(0, 8)}.pdf`);
}

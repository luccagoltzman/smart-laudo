import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import type { InspectionState } from '../types/checklist.types';
import type { ItemStatus, RiskLevel } from '../types/checklist.types';
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

// --- Cores do projeto (RGB 0–255 para jsPDF) ---
const colors = {
  primary: { r: 13, g: 59, b: 44 },           // #0d3b2c
  primaryLight: { r: 22, g: 90, b: 66 },     // #165a42
  white: { r: 255, g: 255, b: 255 },
  text: { r: 26, g: 26, b: 26 },             // #1a1a1a
  textMuted: { r: 92, g: 107, b: 100 },      // #5c6b64
  surface: { r: 232, g: 238, b: 235 },      // #e8eeeb
  border: { r: 197, g: 208, b: 203 },        // #c5d0cb
  // Risco
  riskLow: { r: 26, g: 107, b: 26 },        // #1a6b1a
  riskLowBg: { r: 232, g: 245, b: 232 },
  riskMedium: { r: 154, g: 123, b: 10 },    // #9a7b0a
  riskMediumBg: { r: 255, g: 250, b: 230 },
  riskHigh: { r: 184, g: 50, b: 50 },       // #b83232
  riskHighBg: { r: 255, g: 235, b: 235 },
  // Status
  statusApproved: { r: 34, g: 139, b: 34 },
  statusAttention: { r: 218, g: 165, b: 32 },
  statusRejected: { r: 192, g: 57, b: 57 },
  statusPending: { r: 92, g: 107, b: 100 },
} as const;

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const LINE_HEIGHT = 5.5;
const FONT_NORMAL = 10;
const FONT_SMALL = 9;
const FONT_TITLE = 18;
const FONT_SECTION = 11;
const HEADER_BAR_HEIGHT = 14;
const SECTION_HEADER_HEIGHT = 9;
const IMG_SIZE = 28;
const IMG_GAP = 4;
const IMG_PER_ROW = Math.floor((CONTENT_W + IMG_GAP) / (IMG_SIZE + IMG_GAP));
const FOOTER_Y = PAGE_H - 12;

function getStatusText(status: ItemStatus): string {
  return ITEM_STATUS_LABEL[status];
}

function setColor(doc: jsPDF, c: { r: number; g: number; b: number }) {
  doc.setDrawColor(c.r, c.g, c.b);
  doc.setFillColor(c.r, c.g, c.b);
  doc.setTextColor(c.r, c.g, c.b);
}

function getRiskColors(level: RiskLevel) {
  switch (level) {
    case 'low': return { text: colors.riskLow, bg: colors.riskLowBg };
    case 'medium': return { text: colors.riskMedium, bg: colors.riskMediumBg };
    default: return { text: colors.riskHigh, bg: colors.riskHighBg };
  }
}

function getStatusColor(status: ItemStatus) {
  switch (status) {
    case 'approved': return colors.statusApproved;
    case 'attention': return colors.statusAttention;
    case 'rejected': return colors.statusRejected;
    default: return colors.statusPending;
  }
}

export async function generateLaudoPdf(
  state: InspectionState,
  validationBaseUrl: string
): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = MARGIN;
  let pageNumber = 1;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > FOOTER_Y - 5) {
      doc.addPage();
      y = MARGIN;
      pageNumber += 1;
      drawFooter();
    }
  };

  const drawFooter = () => {
    doc.setFontSize(8);
    setColor(doc, colors.textMuted);
    doc.text('Smart Laudo — Laudo Cautelar de Vistoria Veicular', MARGIN, FOOTER_Y);
    doc.text(`${pageNumber}`, PAGE_W - MARGIN, FOOTER_Y, { align: 'right' });
    setColor(doc, colors.text);
  };

  const text = (str: string, fontSize = FONT_NORMAL, color = colors.text) => {
    addPageIfNeeded(LINE_HEIGHT * 2);
    doc.setFontSize(fontSize);
    setColor(doc, color);
    const lines = doc.splitTextToSize(str, CONTENT_W);
    doc.text(lines, MARGIN, y);
    y += lines.length * LINE_HEIGHT;
    setColor(doc, colors.text);
  };

  const blank = (h = LINE_HEIGHT) => {
    y += h;
    if (y > FOOTER_Y - 5) {
      doc.addPage();
      y = MARGIN;
      pageNumber += 1;
      drawFooter();
    }
  };

  // ----- Header de marca -----
  doc.setFillColor(colors.primary.r, colors.primary.g, colors.primary.b);
  doc.rect(0, 0, PAGE_W, HEADER_BAR_HEIGHT, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  setColor(doc, colors.white);
  doc.text('Smart Laudo', MARGIN, HEADER_BAR_HEIGHT - 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Laudo Cautelar de Vistoria Veicular', MARGIN, HEADER_BAR_HEIGHT - 2);
  setColor(doc, colors.text);
  y = HEADER_BAR_HEIGHT + 10;

  // ----- Bloco título + risco -----
  doc.setFontSize(FONT_TITLE);
  doc.setFont('helvetica', 'bold');
  setColor(doc, colors.primary);
  doc.text('LAUDO CAUTELAR', MARGIN, y);
  y += LINE_HEIGHT * 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_NORMAL);
  setColor(doc, colors.textMuted);
  text(`Emitido em ${new Date(state.createdAt).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}`, FONT_SMALL, colors.textMuted);
  text(`ID: ${state.id}`, FONT_SMALL, colors.textMuted);
  blank(4);

  // Badge de risco com cor
  const riskColors = getRiskColors(state.riskLevel);
  const riskLabel = RISK_LEVEL_LABEL[state.riskLevel];
  const riskStr = `${riskLabel}  •  Score: ${state.riskScore}`;
  const badgeW = Math.min(doc.getTextWidth(riskStr) + 12, CONTENT_W);
  doc.setFillColor(riskColors.bg.r, riskColors.bg.g, riskColors.bg.b);
  doc.setDrawColor(riskColors.text.r, riskColors.text.g, riskColors.text.b);
  doc.roundedRect(MARGIN, y - 4, badgeW, 10, 2, 2, 'FD');
  doc.setFontSize(FONT_SMALL);
  doc.setFont('helvetica', 'bold');
  setColor(doc, riskColors.text);
  doc.text(riskStr, MARGIN + 6, y + 2);
  setColor(doc, colors.text);
  doc.setFont('helvetica', 'normal');
  y += 14;
  blank(6);

  // ----- Dados do veículo (card visual) -----
  const v = state.vehicle;
  const vehicleLines: string[] = [];
  if (v.plate) vehicleLines.push(`Placa: ${v.plate}`);
  if (v.renavam) vehicleLines.push(`Renavam: ${v.renavam}`);
  if (v.chassi) vehicleLines.push(`Chassi: ${v.chassi}`);
  if (v.brand || v.model) vehicleLines.push(`Marca/Modelo: ${[v.brand, v.model].filter(Boolean).join(' ')}`);
  if (v.year) vehicleLines.push(`Ano: ${v.year}`);
  if (v.version) vehicleLines.push(`Versão: ${v.version}`);
  if (v.color) vehicleLines.push(`Cor: ${v.color}`);
  if (v.km) vehicleLines.push(`Quilometragem: ${v.km}`);

  const col1 = vehicleLines.slice(0, Math.ceil(vehicleLines.length / 2));
  const col2 = vehicleLines.slice(Math.ceil(vehicleLines.length / 2));
  const maxRows = Math.max(col1.length, col2.length);
  const colW = CONTENT_W / 2 - 6;
  const vehicleCardH = 6 + LINE_HEIGHT + 2 + maxRows * LINE_HEIGHT + 6;
  addPageIfNeeded(vehicleCardH + 10);

  const vehicleStartY = y;
  doc.setFillColor(colors.surface.r, colors.surface.g, colors.surface.b);
  doc.roundedRect(MARGIN, vehicleStartY, CONTENT_W, vehicleCardH, 2, 2, 'F');
  doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
  doc.roundedRect(MARGIN, vehicleStartY, CONTENT_W, vehicleCardH, 2, 2, 'S');

  y += 6;
  doc.setFontSize(FONT_SECTION);
  doc.setFont('helvetica', 'bold');
  setColor(doc, colors.primary);
  doc.text('Dados do veículo', MARGIN + 4, y);
  setColor(doc, colors.text);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_NORMAL);
  y += LINE_HEIGHT + 2;

  for (let i = 0; i < maxRows; i++) {
    setColor(doc, colors.textMuted);
    if (col1[i]) doc.text(col1[i], MARGIN + 4, y, { maxWidth: colW });
    if (col2[i]) doc.text(col2[i], MARGIN + CONTENT_W / 2 + 2, y, { maxWidth: colW });
    setColor(doc, colors.text);
    y += LINE_HEIGHT;
  }

  y = vehicleStartY + vehicleCardH + 8;

  // ----- Seções do checklist -----
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SECTION);
  setColor(doc, colors.primary);
  let sectionNum = 1;
  for (const section of state.sections) {
    addPageIfNeeded(SECTION_HEADER_HEIGHT + LINE_HEIGHT * 3);

    // Cabeçalho da seção (faixa verde clara)
    doc.setFillColor(colors.surface.r, colors.surface.g, colors.surface.b);
    doc.rect(MARGIN, y, CONTENT_W, SECTION_HEADER_HEIGHT, 'F');
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.rect(MARGIN, y, CONTENT_W, SECTION_HEADER_HEIGHT, 'S');
    doc.text(`${sectionNum}. ${section.title}`, MARGIN + 4, y + 6);
    setColor(doc, colors.text);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT_NORMAL);
    y += SECTION_HEADER_HEIGHT + 4;

    for (const item of section.items) {
      const hasPhotos = (item.photos?.length ?? 0) > 0;
      const photoBlockH = hasPhotos ? Math.ceil((item.photos!.length || 0) / IMG_PER_ROW) * (IMG_SIZE + IMG_GAP) + IMG_GAP : 0;
      addPageIfNeeded(LINE_HEIGHT * 3 + (item.observation ? LINE_HEIGHT * 2 : 0) + photoBlockH);

      const statusStr = getStatusText(item.status);
      const statusColor = getStatusColor(item.status);
      const itemLabel = `${item.label}: `;
      const labelW = doc.getTextWidth(itemLabel);
      doc.setFontSize(FONT_NORMAL);
      setColor(doc, colors.text);
      doc.text(itemLabel, MARGIN, y);
      setColor(doc, statusColor);
      doc.setFont('helvetica', 'bold');
      doc.text(statusStr, MARGIN + labelW, y);
      doc.setFont('helvetica', 'normal');
      setColor(doc, colors.text);
      y += LINE_HEIGHT;

      if (item.observation) {
        doc.setFontSize(FONT_SMALL);
        setColor(doc, colors.textMuted);
        const obsLines = doc.splitTextToSize(`Obs: ${item.observation}`, CONTENT_W - 6);
        doc.text(obsLines, MARGIN + 4, y);
        y += obsLines.length * LINE_HEIGHT;
        doc.setFontSize(FONT_NORMAL);
        setColor(doc, colors.text);
      }

      if (item.photos?.length) {
        let xImg = MARGIN;
        let rowStartY = y;
        for (let i = 0; i < item.photos.length; i++) {
          if (i > 0 && i % IMG_PER_ROW === 0) {
            xImg = MARGIN;
            rowStartY += IMG_SIZE + IMG_GAP;
            y = rowStartY;
            addPageIfNeeded(IMG_SIZE + IMG_GAP + 5);
          }
          const dataUrl = item.photos[i];
          try {
            const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
            doc.rect(xImg, y, IMG_SIZE, IMG_SIZE, 'S');
            doc.addImage(dataUrl, format, xImg + 1, y + 1, IMG_SIZE - 2, IMG_SIZE - 2);
          } catch {
            // skip
          }
          xImg += IMG_SIZE + IMG_GAP;
        }
        y = rowStartY + IMG_SIZE + IMG_GAP + 4;
      }
    }

    blank(4);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(FONT_SECTION);
    setColor(doc, colors.primary);
    sectionNum += 1;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_NORMAL);
  setColor(doc, colors.text);
  blank(8);

  // ----- Assinatura -----
  if (state.signatureDataUrl) {
    addPageIfNeeded(38);
    doc.setFontSize(FONT_SECTION);
    doc.setFont('helvetica', 'bold');
    setColor(doc, colors.primary);
    doc.text('Assinatura do vistoriador', MARGIN, y);
    setColor(doc, colors.text);
    doc.setFont('helvetica', 'normal');
    y += 6;
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.rect(MARGIN, y, 65, 28, 'S');
    try {
      doc.addImage(state.signatureDataUrl, 'PNG', MARGIN + 2, y + 2, 61, 24);
    } catch {
      doc.setFontSize(FONT_SMALL);
      setColor(doc, colors.textMuted);
      doc.text('[Assinatura não renderizada]', MARGIN + 4, y + 16);
      setColor(doc, colors.text);
    }
    y += 34;
  }

  // ----- QR Code -----
  const validationUrl = `${validationBaseUrl}/validar/${state.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(validationUrl, { width: 140, margin: 1 });
    addPageIfNeeded(50);
    doc.setFillColor(colors.surface.r, colors.surface.g, colors.surface.b);
    doc.roundedRect(MARGIN, y, CONTENT_W, 48, 3, 3, 'F');
    doc.setDrawColor(colors.border.r, colors.border.g, colors.border.b);
    doc.roundedRect(MARGIN, y, CONTENT_W, 48, 3, 3, 'S');
    doc.setFontSize(FONT_SECTION);
    doc.setFont('helvetica', 'bold');
    setColor(doc, colors.primary);
    doc.text('Validação do laudo', MARGIN + 6, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT_SMALL);
    setColor(doc, colors.textMuted);
    doc.text('Escaneie o QR Code para confirmar a autenticidade deste laudo.', MARGIN + 6, y + 15);
    setColor(doc, colors.text);
    doc.addImage(qrDataUrl, 'PNG', MARGIN + 6, y + 20, 32, 32);
    doc.setFontSize(7);
    setColor(doc, colors.textMuted);
    const urlLines = doc.splitTextToSize(validationUrl, CONTENT_W - 50);
    doc.text(urlLines, MARGIN + 44, y + 32);
  } catch {
    text(`Valide este laudo em: ${validationUrl}`, FONT_SMALL);
  }

  drawFooter();
  doc.save(`laudo-cautelar-${state.vehicle.plate || state.id.slice(0, 8)}.pdf`);
}

import jsPDF from "jspdf";
import type { Frame, Palette } from "@/lib/qrTemplates";

type CardData = {
  frame: Frame;
  palette: Palette;
  eventTitle?: string;
  eventSubtitle?: string;
  eventDate?: string;
  qrSrc: string;
  logoSrc?: string;
};

const PAGE_W = 210;
const PAGE_H = 297;
const CARD_W = 90;
const CARD_H = 120;
const GAP_X = (PAGE_W - CARD_W * 2) / 3;
const GAP_Y = (PAGE_H - CARD_H * 2) / 3;
const POSITIONS: [number, number][] = [
  [GAP_X, GAP_Y],
  [GAP_X * 2 + CARD_W, GAP_Y],
  [GAP_X, GAP_Y * 2 + CARD_H],
  [GAP_X * 2 + CARD_W, GAP_Y * 2 + CARD_H],
];

function drawCard(doc: jsPDF, x: number, y: number, data: CardData) {
  const { frame, palette, eventTitle, eventSubtitle, eventDate, qrSrc, logoSrc } = data;
  const radius = Math.min(frame.radius / 4, 10);

  doc.setFillColor(palette.bg);
  doc.roundedRect(x, y, CARD_W, CARD_H, radius, radius, "F");

  doc.setDrawColor(palette.accent);
  doc.setLineWidth(frame.borderStyle === "double" ? 1.4 : 0.6);
  doc.setLineDashPattern(frame.borderStyle === "dashed" ? [2, 2] : frame.borderStyle === "dotted" ? [0.6, 1.2] : [], 0);
  doc.roundedRect(x + 2.5, y + 2.5, CARD_W - 5, CARD_H - 5, radius, radius, "S");
  doc.setLineDashPattern([], 0);

  if (frame.innerInset) {
    doc.setLineWidth(0.3);
    doc.roundedRect(x + 6, y + 6, CARD_W - 12, CARD_H - 12, Math.max(radius - 2, 0), Math.max(radius - 2, 0), "S");
  }

  if (frame.cornerMarks) {
    const m = 5;
    const corners: [number, number, number, number][] = [
      [x + 6, y + 6, 1, 1],
      [x + CARD_W - 6, y + 6, -1, 1],
      [x + 6, y + CARD_H - 6, 1, -1],
      [x + CARD_W - 6, y + CARD_H - 6, -1, -1],
    ];
    doc.setLineWidth(0.6);
    for (const [cx, cy, dx, dy] of corners) {
      doc.line(cx, cy, cx + dx * m, cy);
      doc.line(cx, cy, cx, cy + dy * m);
    }
  }

  if (logoSrc) {
    try {
      doc.addImage(logoSrc, x + CARD_W / 2 - 8, y + 12, 16, 16);
    } catch {
      // formato de imagem não suportado pelo PDF — segue sem o logo
    }
  }

  doc.setTextColor(palette.accent);
  doc.setFontSize(11);
  if (eventTitle) doc.text(eventTitle, x + CARD_W / 2, y + 38, { align: "center", maxWidth: CARD_W - 16 });

  doc.setTextColor(palette.ink);
  doc.setFontSize(8);
  if (eventSubtitle) doc.text(eventSubtitle, x + CARD_W / 2, y + 45, { align: "center", maxWidth: CARD_W - 16 });

  const qrSize = 46;
  doc.addImage(qrSrc, x + CARD_W / 2 - qrSize / 2, y + CARD_H / 2 - qrSize / 2 + 4, qrSize, qrSize);

  doc.setFontSize(7);
  doc.setTextColor(palette.ink);
  if (eventDate) doc.text(eventDate, x + CARD_W / 2, y + CARD_H - 8, { align: "center" });
}

export function buildQrPdf(data: CardData, quantity: number): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  for (let i = 0; i < quantity; i++) {
    const posIndex = i % 4;
    if (posIndex === 0 && i > 0) doc.addPage();
    const [x, y] = POSITIONS[posIndex];
    drawCard(doc, x, y, data);
  }
  return doc;
}

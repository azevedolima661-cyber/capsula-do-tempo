export type Frame = {
  id: string;
  name: string;
  radius: number; // px, used for CSS preview (scaled down for PDF)
  borderStyle: "solid" | "dashed" | "dotted" | "double";
  cornerMarks: boolean;
  innerInset: boolean;
};

export const FRAMES: Frame[] = [
  { id: "classica", name: "Clássica", radius: 4, borderStyle: "solid", cornerMarks: false, innerInset: false },
  { id: "dupla", name: "Linha dupla", radius: 8, borderStyle: "double", cornerMarks: false, innerInset: false },
  { id: "arredondada", name: "Arredondada", radius: 28, borderStyle: "solid", cornerMarks: false, innerInset: false },
  { id: "pontilhada", name: "Pontilhada", radius: 12, borderStyle: "dotted", cornerMarks: false, innerInset: false },
  { id: "tracejada", name: "Tracejada", radius: 4, borderStyle: "dashed", cornerMarks: false, innerInset: false },
  { id: "cantos", name: "Cantos marcados", radius: 4, borderStyle: "solid", cornerMarks: true, innerInset: false },
  { id: "moldura-dupla", name: "Moldura dupla", radius: 12, borderStyle: "solid", cornerMarks: false, innerInset: true },
  { id: "elegante", name: "Elegante", radius: 20, borderStyle: "double", cornerMarks: false, innerInset: true },
  { id: "minimal", name: "Minimalista", radius: 0, borderStyle: "solid", cornerMarks: false, innerInset: false },
  { id: "convite", name: "Convite clássico", radius: 16, borderStyle: "solid", cornerMarks: true, innerInset: true },
];

export type Palette = {
  id: string;
  name: string;
  bg: string;
  ink: string;
  accent: string;
};

export const PALETTES: Palette[] = [
  { id: "rose", name: "Rosé", bg: "#fdf8f3", ink: "#262626", accent: "#e4a4bd" },
  { id: "sage", name: "Verde-sálvia", bg: "#f6f8f1", ink: "#2c3320", accent: "#8aa06b" },
  { id: "navy", name: "Azul-marinho", bg: "#f2f4f8", ink: "#1c2436", accent: "#34507a" },
  { id: "terracota", name: "Terracota", bg: "#fbf3ec", ink: "#3a2317", accent: "#c4623c" },
  { id: "lilas", name: "Lilás", bg: "#f7f2fa", ink: "#2e2438", accent: "#9b6fc2" },
  { id: "dourado", name: "Dourado", bg: "#fdfaf1", ink: "#332b14", accent: "#bd9b3e" },
  { id: "grafite", name: "Grafite", bg: "#f3f3f3", ink: "#1a1a1a", accent: "#4d4d4d" },
  { id: "blush", name: "Blush", bg: "#fff4f4", ink: "#3a1f1f", accent: "#e07a7a" },
  { id: "floresta", name: "Verde-floresta", bg: "#f1f6f1", ink: "#1c2e1c", accent: "#2f6b3f" },
  { id: "carvao-creme", name: "Carvão & creme", bg: "#262626", ink: "#fdf8f3", accent: "#e4a4bd" },
];

export type Template = { id: string; frame: Frame; palette: Palette };

export function getTemplates(): Template[] {
  const templates: Template[] = [];
  for (const frame of FRAMES) {
    for (const palette of PALETTES) {
      templates.push({ id: `${frame.id}__${palette.id}`, frame, palette });
    }
  }
  return templates;
}

export function findTemplate(frameId: string, paletteId: string): Template {
  const frame = FRAMES.find((f) => f.id === frameId) ?? FRAMES[0];
  const palette = PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  return { id: `${frame.id}__${palette.id}`, frame, palette };
}

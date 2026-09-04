/**
 * Maps the Vietnamese color-variant labels used in mockData.ts to a
 * representative hex swatch. Names that describe a process rather than a
 * hue (e.g. "Sơn Phết Thủ Công", "Theo yêu cầu thương hiệu") fall back to a
 * neutral gray — the full label is still shown via title/tooltip.
 */
const COLOR_MAP: Record<string, string> = {
  "Cyber Black": "#1c1917",
  "Neon Lime": "#a3e635",
  "Clear Resin": "#e5e7eb",
  "Cyber Yellow": "#facc15",
  "Xám Base": "#9ca3af",
  "Trắng": "#f5f5f4",
  "Đen/Xanh Lá": "#166534",
  "Trắng/Cam": "#fb923c",
  "Gỗ Sồi Trắng": "#e7d5b7",
  "Gỗ Óc Chó": "#5c3d2e",
  "Đỏ Gạch": "#b91c1c",
  "Gỗ Cổ": "#7c5a3a",
  "Đá Sa Thạch": "#c2a878",
  "Đá Xám Cổ": "#6b7280",
  "Sơn Phết Thủ Công": "#a8a29e",
  "Màu Nhựa Gốc": "#d4d4d8",
  "Theo yêu cầu thương hiệu": "#a8a29e",
};

const FALLBACK = "#a8a29e";

export function getColorSwatch(label: string): string {
  return COLOR_MAP[label] ?? FALLBACK;
}

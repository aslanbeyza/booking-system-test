/**
 * Sun → Sat (matches `Date.getDay()` column order: 0 = Sunday).
 * Short labels to fit the 7-column grid.
 */
export const WEEKDAY_LABELS_AR = [
  "أحد",
  "إثن",
  "ثلا",
  "أرب",
  "خمي",
  "جمع",
  "سبت",
] as const;

const GRID_CELLS = 42; /* 7 × 6 sabit satır — dış kart yüksekliği + scroll yok */

/** Ay grid’i; her zaman 42 hücre (kısa aylar son satırda boş) */
export function getMonthGrid(year: number, monthIndex0: number): (number | null)[] {
  const first = new Date(year, monthIndex0, 1).getDay();
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < GRID_CELLS) cells.push(null);
  return cells.slice(0, GRID_CELLS);
}

export const DEFAULT_TIMES = [
  "11:00 ص",
  "12:00 م",
  "01:00 م",
  "10:00 ص",
  "09:00 ص",
  "02:00 م",
  "03:00 م",
  "04:00 م",
  "05:00 م",
] as const;

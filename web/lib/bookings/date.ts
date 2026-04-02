/** Takvim seçiminden API `date=YYYY-MM-DD` parametresi */
export function toBookingDateString(
  year: number,
  monthIndex: number,
  day: number,
): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

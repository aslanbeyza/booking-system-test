/**
 * Frontend ile aynı slot etiketleri — tek kaynak için ileride packages/shared taşınabilir.
 * Saatler Asia/Riyadh (+03:00) kabul edilir.
 */
export const BOOKING_SLOT_LABELS = [
  "09:00 ص",
  "10:00 ص",
  "11:00 ص",
  "12:00 م",
  "01:00 م",
  "02:00 م",
  "03:00 م",
  "04:00 م",
  "05:00 م",
] as const;

export type BookingSlotLabel = (typeof BOOKING_SLOT_LABELS)[number];

const SLOT_LOCAL: Record<BookingSlotLabel, { h: number; m: number }> = {
  "09:00 ص": { h: 9, m: 0 },
  "10:00 ص": { h: 10, m: 0 },
  "11:00 ص": { h: 11, m: 0 },
  "12:00 م": { h: 12, m: 0 },
  "01:00 م": { h: 13, m: 0 },
  "02:00 م": { h: 14, m: 0 },
  "03:00 م": { h: 15, m: 0 },
  "04:00 م": { h: 16, m: 0 },
  "05:00 م": { h: 17, m: 0 },
};

export const SESSION_DURATION_MINUTES = 60;

/** ISO tarih (YYYY-MM-DD) + slot etiketi → başlangıç/bitiş (UTC Date) */
export function slotToUtcRange(
  dateStr: string,
  label: string,
): { startsAt: Date; endsAt: Date } | null {
  if (!(label in SLOT_LOCAL)) return null;
  const { h, m } = SLOT_LOCAL[label as BookingSlotLabel];
  const pad = (n: number) => String(n).padStart(2, "0");
  const isoLocal = `${dateStr}T${pad(h)}:${pad(m)}:00+03:00`;
  const startsAt = new Date(isoLocal);
  const endsAt = new Date(
    startsAt.getTime() + SESSION_DURATION_MINUTES * 60 * 1000,
  );
  return { startsAt, endsAt };
}

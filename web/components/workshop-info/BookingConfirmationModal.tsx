"use client";

type BookingConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  timeSlotLabel: string;
  dateLabel: string;
  bookingId: string;
};

export default function BookingConfirmationModal({
  open,
  onClose,
  timeSlotLabel,
  dateLabel,
  bookingId,
}: BookingConfirmationModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-confirm-title"
    >
      <div
        dir="rtl"
        className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-xl"
      >
        <h2
          id="booking-confirm-title"
          className="text-right text-lg font-bold text-[#1C1C1C] [font-family:var(--font-avenir-arabic)]"
        >
          تم تأكيد الحجز
        </h2>
        <p className="mt-3 text-right text-sm leading-6 text-black/70 [font-family:var(--font-avenir-arabic)]">
          تم حجز جلستك بنجاح.
        </p>
        <ul className="mt-4 space-y-2 text-right text-sm text-black/80 [font-family:var(--font-avenir-arabic)]">
          <li>
            <span className="text-black/50">التاريخ: </span>
            {dateLabel}
          </li>
          <li>
            <span className="text-black/50">الوقت: </span>
            {timeSlotLabel}
          </li>
          <li className="truncate text-xs text-black/45" title={bookingId}>
            <span className="text-black/50">المعرف: </span>
            {bookingId}
          </li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#1877f2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#166fe5] [font-family:var(--font-avenir-arabic)]"
        >
          حسناً
        </button>
      </div>
    </div>
  );
}

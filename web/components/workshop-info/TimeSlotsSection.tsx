import type { AvailableSessionsResponse } from "@booking/shared";

type TimeSlotsSectionProps = {
  title?: string;
  subtitle?: string;
  /** API’den gelen slotlar; yoksa yükleme veya boş durum */
  sessions?: AvailableSessionsResponse | null;
  loading?: boolean;
  errorMessage?: string | null;
  selectedTime: string | null;
  onSelectTime?: (t: string) => void;
};

export default function TimeSlotsSection({
  title = "الأوقات المتاحة",
  subtitle,
  sessions,
  loading = false,
  errorMessage,
  selectedTime,
  onSelectTime,
}: TimeSlotsSectionProps) {
  const slots = sessions?.slots ?? [];

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-right">
        <div className="text-base font-semibold text-black/90 [font-family:var(--font-avenir-arabic)]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs leading-relaxed text-black/55 [font-family:var(--font-avenir-arabic)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="mt-4 text-right text-sm text-red-600 [font-family:var(--font-avenir-arabic)]">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="h-10 animate-pulse rounded-lg bg-black/[0.06]"
              />
            ))
          : slots.map((slot) => {
              const active = selectedTime === slot.timeSlot;
              const disabled = !slot.available;
              return (
                <button
                  key={slot.timeSlot}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onSelectTime?.(slot.timeSlot)}
                  className={[
                    "rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition [font-family:var(--font-avenir-arabic)]",
                    disabled
                      ? "cursor-not-allowed border-black/10 bg-black/[0.04] text-black/35"
                      : active
                        ? "border-[#1877f2] bg-[#1877f2] text-white shadow-sm"
                        : "border-black/12 bg-white text-black/85 hover:border-black/20",
                  ].join(" ")}
                >
                  {slot.timeSlot}
                </button>
              );
            })}
      </div>
    </div>
  );
}

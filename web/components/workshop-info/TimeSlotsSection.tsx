import { DEFAULT_TIMES } from "./constants";

type TimeSlotsSectionProps = {
  title?: string;
  subtitle?: string;
  times?: readonly string[];
  selectedTime: string | null;
  onSelectTime?: (t: string) => void;
};

export default function TimeSlotsSection({
  title = "الأوقات المتاحة",
  subtitle,
  times = DEFAULT_TIMES,
  selectedTime,
  onSelectTime,
}: TimeSlotsSectionProps) {
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

      <div className="mt-4 grid grid-cols-3 gap-2">
        {times.map((t) => {
          const active = selectedTime === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelectTime?.(t)}
              className={[
                "rounded-lg border px-2 py-2 text-center text-xs font-medium transition [font-family:var(--font-avenir-arabic)]",
                active
                  ? "border-[#2563eb] bg-[#2563eb] text-white"
                  : "border-black/15 bg-white text-black/80 hover:border-black/25",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

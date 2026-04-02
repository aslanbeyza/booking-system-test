import { WEEKDAY_LABELS_AR } from "./constants";

type CalendarGridProps = {
  cells: (number | null)[];
  selectedDay: number | null;
  onSelectDay?: (day: number) => void;
};

export default function CalendarGrid({
  cells,
  selectedDay,
  onSelectDay,
}: CalendarGridProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-7 gap-1 text-center text-[10px] leading-tight text-black/50">
        {WEEKDAY_LABELS_AR.map((d) => (
          <div key={d} className="py-0.5">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-1">
        {cells.map((cell, idx) => {
          if (cell === null) {
            return <div key={`e-${idx}`} className="min-h-0" />;
          }
          const isSelected = selectedDay === cell;
          return (
            <div
              key={`${cell}-${idx}`}
              className="flex min-h-0 items-center justify-center p-0.5"
            >
              <button
                type="button"
                onClick={() => onSelectDay?.(cell)}
                className={[
                  "flex h-8 w-8 max-h-full max-w-full shrink-0 items-center justify-center rounded-full text-xs font-medium transition sm:h-9 sm:w-9 sm:text-sm",
                  isSelected
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-black/80 hover:bg-black/5",
                ].join(" ")}
              >
                {cell}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

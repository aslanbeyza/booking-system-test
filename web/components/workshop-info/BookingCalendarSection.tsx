import { getMonthGrid } from "./constants";
import CalendarGrid from "./CalendarGrid";
import MonthNavigator from "./MonthNavigator";

type BookingCalendarSectionProps = {
  title?: string;
  subtitle?: string;
  monthLabel: string;
  year: number;
  monthIndex: number;
  selectedDay: number | null;
  onSelectDay?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
};

export default function BookingCalendarSection({
  title = "الأيام المتاحة",
  subtitle,
  monthLabel,
  year,
  monthIndex,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: BookingCalendarSectionProps) {
  const cells = getMonthGrid(year, monthIndex);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="shrink-0 text-right">
        <div className="text-base font-semibold text-black/90 [font-family:var(--font-avenir-arabic)]">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs leading-relaxed text-black/55 [font-family:var(--font-avenir-arabic)]">
            {subtitle}
          </div>
        ) : null}
      </div>

      <div className="mt-4 shrink-0">
        <MonthNavigator label={monthLabel} onPrev={onPrevMonth} onNext={onNextMonth} />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
        <CalendarGrid
          cells={cells}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
        />
      </div>
    </div>
  );
}

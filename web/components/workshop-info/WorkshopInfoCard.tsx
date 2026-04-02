"use client";

import { useMemo, useState } from "react";

import BookSessionButton from "./BookSessionButton";
import BookingCalendarSection from "./BookingCalendarSection";
import TimeSlotsSection from "./TimeSlotsSection";

const MONTH_NAMES_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
] as const;

const workshopCardClass =
  "rounded-2xl border border-black/10 bg-[#F7F7F7] p-5 shadow-sm wrap-break-word";

/** Dış kart sabit; ay değişince yükseklik oynamasın (içerik beyaz kutuda kayar) */
const CALENDAR_OUTER_HEIGHT_CLASS = "h-[400px]";

export default function WorkshopInfoCard() {
  const initial = useMemo(() => ({ y: 2022, m: 0 }), []);
  const [year, setYear] = useState(initial.y);
  const [monthIndex, setMonthIndex] = useState(initial.m);
  const [selectedDay, setSelectedDay] = useState<number | null>(6);
  const [selectedTime, setSelectedTime] = useState<string | null>("11:00 ص");

  const monthLabel = `${MONTH_NAMES_AR[monthIndex]} ${year}`;

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  }

  return (
    <div dir="rtl" className="flex w-full min-w-0 max-w-[380px] flex-col gap-5">
      <section
        className={`flex flex-col overflow-hidden ${CALENDAR_OUTER_HEIGHT_CLASS} ${workshopCardClass}`}
      >
        <BookingCalendarSection
          monthLabel={monthLabel}
          year={year}
          monthIndex={monthIndex}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={() => shiftMonth(-1)}
          onNextMonth={() => shiftMonth(1)}
        />
      </section>

      <section className={`flex flex-col gap-5 ${workshopCardClass}`}>
        <TimeSlotsSection
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
        <BookSessionButton />
      </section>
    </div>
  );
}

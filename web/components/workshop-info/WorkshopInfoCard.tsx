"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BookingApiError,
  createBooking,
  fetchAvailableSessions,
} from "@/lib/bookings/api";
import { toBookingDateString } from "@/lib/bookings/date";
import type { AvailableSessionsResponse } from "@booking/shared";

import BookSessionButton from "./BookSessionButton";
import BookingCalendarSection from "./BookingCalendarSection";
import BookingConfirmationModal from "./BookingConfirmationModal";
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

const CALENDAR_OUTER_HEIGHT_CLASS = "h-[400px]";

export default function WorkshopInfoCard() {
  const initial = useMemo(() => ({ y: 2022, m: 0 }), []);
  const [year, setYear] = useState(initial.y);
  const [monthIndex, setMonthIndex] = useState(initial.m);
  const [selectedDay, setSelectedDay] = useState<number | null>(19);
  const [selectedTime, setSelectedTime] = useState<string | null>("10:00 ص");

  const [sessions, setSessions] = useState<AvailableSessionsResponse | null>(
    null,
  );
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const monthLabel = `${MONTH_NAMES_AR[monthIndex]} ${year}`;

  const selectedDateStr =
    selectedDay != null
      ? toBookingDateString(year, monthIndex, selectedDay)
      : null;

  function shiftMonth(delta: number) {
    const d = new Date(year, monthIndex + delta, 1);
    setYear(d.getFullYear());
    setMonthIndex(d.getMonth());
  }

  useEffect(() => {
    const maxDay = new Date(year, monthIndex + 1, 0).getDate();
    setSelectedDay((day) => {
      if (day == null) return day;
      return day > maxDay ? maxDay : day;
    });
  }, [year, monthIndex]);

  useEffect(() => {
    if (selectedDateStr == null) return;

    let cancelled = false;
    setLoadingSlots(true);
    setSlotsError(null);

    fetchAvailableSessions(selectedDateStr)
      .then((data) => {
        if (cancelled) return;
        setSessions(data);
        setSelectedTime((prev) => {
          const cur = data.slots.find((s) => s.timeSlot === prev && s.available);
          if (cur) return prev;
          const first = data.slots.find((s) => s.available);
          return first?.timeSlot ?? null;
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setSessions(null);
        setSlotsError(
          e instanceof BookingApiError
            ? e.message
            : e instanceof Error
              ? e.message
              : "تعذر تحميل الأوقات",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDateStr]);

  const selectedSlotAvailable =
    sessions?.slots.some(
      (s) => s.timeSlot === selectedTime && s.available,
    ) ?? false;

  const handleBook = async () => {
    if (!selectedDateStr || !selectedTime || !selectedSlotAvailable) return;
    setBookError(null);
    setBookSuccess(null);
    setBookingLoading(true);
    try {
      const res = await createBooking({
        date: selectedDateStr,
        timeSlot: selectedTime,
      });
      setBookSuccess(res.message);
      setConfirmedId(res.id);
      setModalOpen(true);
      const fresh = await fetchAvailableSessions(selectedDateStr);
      setSessions(fresh);
    } catch (e: unknown) {
      setBookError(
        e instanceof BookingApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "فشل الحجز",
      );
    } finally {
      setBookingLoading(false);
    }
  };

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
          sessions={sessions}
          loading={loadingSlots}
          errorMessage={slotsError}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
        {bookError ? (
          <p className="text-right text-sm text-red-600 [font-family:var(--font-avenir-arabic)]">
            {bookError}
          </p>
        ) : null}
        {bookSuccess ? (
          <p
            role="status"
            className="text-right text-sm font-medium text-emerald-700 [font-family:var(--font-avenir-arabic)]"
          >
            {bookSuccess}
          </p>
        ) : null}
        <BookSessionButton
          onClick={handleBook}
          loading={bookingLoading}
          disabled={
            !selectedTime ||
            !selectedSlotAvailable ||
            loadingSlots ||
            !!slotsError
          }
        />
      </section>

      <BookingConfirmationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setBookSuccess(null);
        }}
        timeSlotLabel={selectedTime ?? ""}
        dateLabel={selectedDateStr ?? ""}
        bookingId={confirmedId ?? ""}
      />
    </div>
  );
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { CreateBookingPayload } from "@booking/shared";
import { BookingsRepository } from "./bookings.repository";
import {
  BOOKING_SLOT_LABELS,
  SESSION_DURATION_MINUTES,
  slotToUtcRange,
} from "./slot.utils";

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly config: ConfigService,
  ) {}

  /**
   * Belirtilen gün için müsait slotları döner; veritabanında kayıtlı olanlar elenir.
   */
  async getAvailableSessions(dateStr: string) {
    const ranges = BOOKING_SLOT_LABELS.map((l) => slotToUtcRange(dateStr, l)).filter(
      (x): x is NonNullable<typeof x> => x != null,
    );
    if (ranges.length === 0) {
      return { date: dateStr, timezone: "Asia/Riyadh", slots: [] };
    }
    const minStart = new Date(
      Math.min(...ranges.map((r) => r.startsAt.getTime())),
    );
    const lastSlotStart = new Date(
      Math.max(...ranges.map((r) => r.startsAt.getTime())),
    );

    const booked = await this.bookingsRepository.findStartsBetween(
      minStart,
      lastSlotStart,
    );

    const bookedStarts = new Set(booked.map((b) => b.startsAt.getTime()));

    const slots = BOOKING_SLOT_LABELS.map((label) => {
      const range = slotToUtcRange(dateStr, label);
      if (!range) {
        return {
          timeSlot: label,
          durationMinutes: SESSION_DURATION_MINUTES,
          startsAt: null as string | null,
          available: false,
        };
      }
      const taken = bookedStarts.has(range.startsAt.getTime());
      return {
        timeSlot: label,
        durationMinutes: SESSION_DURATION_MINUTES,
        startsAt: range.startsAt.toISOString(),
        available: !taken,
      };
    });

    return {
      date: dateStr,
      timezone: "Asia/Riyadh",
      slots,
    };
  }

  async createBooking(body: CreateBookingPayload) {
    const range = slotToUtcRange(body.date, body.timeSlot);
    if (!range) {
      throw new NotFoundException("Geçersiz veya desteklenmeyen saat dilimi");
    }

    try {
      const profileId = this.config.getOrThrow<string>("BOOKING_PROFILE_ID");
      const row = await this.bookingsRepository.insertBooking({
        userId: body.userId,
        profileId,
        startsAt: range.startsAt,
        endsAt: range.endsAt,
        timeSlotLabel: body.timeSlot,
      });

      return {
        success: true as const,
        message: "تم حجز الجلسة بنجاح.",
        id: row.id,
        startsAt: row.startsAt.toISOString(),
        endsAt: row.endsAt.toISOString(),
        timeSlotLabel: row.timeSlotLabel,
      };
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === "23505") {
        throw new ConflictException(
          "Bu saat için rezervasyon zaten var (eşzamanlı istek)",
        );
      }
      throw e;
    }
  }
}

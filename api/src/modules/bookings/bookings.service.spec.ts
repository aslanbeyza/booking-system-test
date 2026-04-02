import { ConflictException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { BookingsRepository } from "./bookings.repository";
import { BookingsService } from "./bookings.service";

describe("BookingsService", () => {
  let service: BookingsService;
  const findStartsBetween = jest.fn();
  const insertBooking = jest.fn();
  const mockRepo = { findStartsBetween, insertBooking };
  const mockConfig = {
    getOrThrow: jest
      .fn()
      .mockReturnValue("11111111-1111-1111-1111-111111111111"),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BookingsRepository, useValue: mockRepo },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();
    service = moduleRef.get(BookingsService);
  });

  describe("getAvailableSessions", () => {
    it("returns slots with duration, timezone Asia/Riyadh", async () => {
      findStartsBetween.mockResolvedValue([]);
      const r = await service.getAvailableSessions("2022-05-12");
      expect(r.timezone).toBe("Asia/Riyadh");
      expect(r.date).toBe("2022-05-12");
      expect(r.slots.length).toBe(9);
      expect(r.slots[0].durationMinutes).toBe(60);
    });

    it("marks slot unavailable when start time is already booked", async () => {
      const bookedStart = new Date("2022-05-12T07:00:00.000Z");
      findStartsBetween.mockResolvedValue([{ startsAt: bookedStart }]);
      const r = await service.getAvailableSessions("2022-05-12");
      const ten = r.slots.find((s) => s.timeSlot === "10:00 ص");
      expect(ten?.available).toBe(false);
    });
  });

  describe("createBooking", () => {
    it("throws NotFoundException for unknown time slot label", async () => {
      await expect(
        service.createBooking({
          userId: "00000000-0000-0000-0000-000000000001",
          date: "2022-05-12",
          timeSlot: "invalid",
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(insertBooking).not.toHaveBeenCalled();
    });

    it("returns success payload when insert succeeds", async () => {
      insertBooking.mockResolvedValue({
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        startsAt: new Date("2022-05-12T07:00:00.000Z"),
        endsAt: new Date("2022-05-12T08:00:00.000Z"),
        timeSlotLabel: "10:00 ص",
      });
      const r = await service.createBooking({
        userId: "00000000-0000-0000-0000-000000000001",
        date: "2022-05-12",
        timeSlot: "10:00 ص",
      });
      expect(r.success).toBe(true);
      expect(r.message).toBeDefined();
      expect(r.id).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    });

    it("throws ConflictException on concurrent duplicate (Postgres 23505)", async () => {
      insertBooking.mockRejectedValue(Object.assign(new Error("dup"), { code: "23505" }));
      await expect(
        service.createBooking({
          userId: "00000000-0000-0000-0000-000000000001",
          date: "2022-05-12",
          timeSlot: "10:00 ص",
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});

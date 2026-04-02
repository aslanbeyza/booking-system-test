import { Injectable } from "@nestjs/common";
import { and, gte, lte } from "drizzle-orm";

import { DrizzleService } from "../../database/drizzle.service";
import { bookings } from "../../database/schema";

@Injectable()
export class BookingsRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findStartsBetween(minStart: Date, lastSlotStart: Date) {
    return this.drizzle.db
      .select({ startsAt: bookings.startsAt })
      .from(bookings)
      .where(
        and(
          gte(bookings.startsAt, minStart),
          lte(bookings.startsAt, lastSlotStart),
        ),
      );
  }

  async insertBooking(values: {
    userId: string;
    profileId: string;
    startsAt: Date;
    endsAt: Date;
    timeSlotLabel: string;
  }) {
    const [row] = await this.drizzle.db
      .insert(bookings)
      .values({
        ...values,
        startTime: values.startsAt,
        endTime: values.endsAt,
      })
      .returning();
    return row;
  }
}

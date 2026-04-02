import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users";

/**
 * Rezervasyon kayıtları.
 * Aynı başlangıç zamanına çift rezervasyonu engellemek için unique index.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Danışman / atölye profili — `BOOKING_PROFILE_ID` ile doldurulur */
    profileId: uuid("profile_id").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    /** Eski şemalarla uyum — `starts_at` ile aynı anında uygulama doldurur */
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    /** Eski şemalarla uyum — `ends_at` ile aynı anda uygulama doldurur */
    endTime: timestamp("end_time", { withTimezone: true }).notNull(),
    /** UI’da gösterilen slot etiketi (örn. "11:00 ص") */
    timeSlotLabel: text("time_slot_label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("bookings_profile_id_idx").on(t.profileId),
    index("bookings_starts_at_idx").on(t.startsAt),
    index("bookings_user_id_idx").on(t.userId),
    uniqueIndex("bookings_starts_at_unique").on(t.startsAt),
  ],
);

import { Global, Module } from "@nestjs/common";

import { DrizzleService } from "./drizzle.service";

/**
 * Tüm modüller `DrizzleService` ile Drizzle + PostgreSQL erişir.
 * Yeni tablolar: src/database/schema altına ekleyin, migration üretin.
 */
@Global()
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DatabaseModule {}

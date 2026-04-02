import { existsSync } from "fs";
import { join } from "path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validateEnv } from "./config/validate-env";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BookingsModule } from "./modules/bookings/bookings.module";

/** Monorepo kökünden veya `api/` içinden çalışırken .env bulunur */
const envFileCandidates = [
  join(process.cwd(), ".env"),
  join(process.cwd(), "api", ".env"),
];
const envFilePath = envFileCandidates.filter((p) => existsSync(p));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath.length ? envFilePath : [".env"],
      validate: validateEnv,
    }),
    DatabaseModule,
    AuthModule,
    BookingsModule,
  ],
})
export class AppModule {}

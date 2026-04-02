import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export type AppDatabase = NodePgDatabase<typeof schema>;

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DrizzleService.name);
  private pool!: Pool;
  private _db!: AppDatabase;

  constructor(private readonly config: ConfigService) {}

  get db(): AppDatabase {
    return this._db;
  }

  onModuleInit() {
    const url = this.config.getOrThrow<string>("DATABASE_URL");
    this.pool = new Pool({ connectionString: url, max: 10 });
    this._db = drizzle(this.pool, { schema });
    this.logger.log("PostgreSQL bağlantı havuzu hazır");
  }

  async onModuleDestroy() {
    await this.pool?.end();
    this.logger.log("PostgreSQL bağlantı havuzu kapatıldı");
  }
}

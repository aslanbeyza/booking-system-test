import { defineConfig } from "drizzle-kit";

/**
 * Şema: src/database/schema
 * Çıktı: drizzle/ (migration SQL)
 *
 * Kullanım:
 *   DATABASE_URL=... pnpm db:generate
 *   DATABASE_URL=... pnpm db:migrate
 */
export default defineConfig({
  schema: "./src/database/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});

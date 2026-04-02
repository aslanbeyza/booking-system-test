/**
 * bookings tablosunu Drizzle şemasına hizalar (starts_at, profile_id, …).
 * Kullanım: `cd api && pnpm db:ensure-bookings`
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runSqlFile(client, filename) {
  const sqlPath = join(__dirname, "../drizzle", filename);
  const raw = readFileSync(sqlPath, "utf8");
  const statements = raw
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await client.query(stmt);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL gerekli");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  await client.connect();

  try {
    const { rows } = await client.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'bookings'
      ) AS exists`,
    );
    if (!rows[0]?.exists) {
      console.error(
        "bookings tablosu yok. Önce: pnpm db:migrate (veya drizzle 0000).",
      );
      process.exit(1);
    }

    await runSqlFile(client, "0004_bookings_align.sql");
    await runSqlFile(client, "0005_bookings_profile_id.sql");
    await runSqlFile(client, "0006_bookings_start_time.sql");
    await runSqlFile(client, "0007_bookings_end_time.sql");
    console.log(
      "OK: bookings (starts_at/ends_at, start_time/end_time, profile_id, …) şemaya uyumlu.",
    );
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

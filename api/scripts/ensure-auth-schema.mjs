/**
 * DB şemasını auth + Drizzle ile hizalar.
 * - `users` yoksa: 0001_users_auth.sql (users + bookings FK)
 * - `users` varsa ama eksik sütun varsa: 0002 (created_at)
 *
 * Kullanım (api/ kökünden): set -a && source .env && set +a && pnpm db:ensure-auth
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function ensureUsersColumns(client) {
  const sqlPath = join(__dirname, "../drizzle/0002_users_created_at.sql");
  const sql = readFileSync(sqlPath, "utf8").trim();
  await client.query(sql);

  // Eski şema: "password" sütunu → Drizzle "password_hash"
  await client.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
      ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
      ) THEN
        ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";
      END IF;
    END $$;
  `);

  await client.query(`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;
  `);
}

async function ensureUsersName(client) {
  const sqlPath = join(__dirname, "../drizzle/0003_users_name.sql");
  const raw = readFileSync(sqlPath, "utf8");
  const statements = raw
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));
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
        WHERE table_schema = 'public' AND table_name = 'users'
      ) AS exists`,
    );
    const usersExists = rows[0]?.exists;

    if (!usersExists) {
      const sqlPath = join(__dirname, "../drizzle/0001_users_auth.sql");
      const raw = readFileSync(sqlPath, "utf8");
      const statements = raw
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        await client.query(stmt);
      }
      await ensureUsersName(client);
      console.log(
        "OK: 0001_users_auth.sql + name sütunu uygulandı (users + bookings FK).",
      );
      return;
    }

    await ensureUsersColumns(client);
    await ensureUsersName(client);
    console.log(
      "OK: users sütunları hizalandı (created_at, password_hash, name).",
    );
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

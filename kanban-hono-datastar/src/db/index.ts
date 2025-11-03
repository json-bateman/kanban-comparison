import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("./drizzle/db.sqlite", { create: true });

// Enable WAL mode for better concurrent access
sqlite.exec("PRAGMA journal_mode = WAL;");

// Set busy timeout to handle locked database gracefully
sqlite.exec("PRAGMA busy_timeout = 5000;");

export const db = drizzle(sqlite);

// Graceful shutdown handler
if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    sqlite.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    sqlite.close();
    process.exit(0);
  });
}

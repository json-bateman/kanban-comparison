// Run database migrations
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

const sqlite = new Database("drizzle/db.sqlite", { create: true });
const db = drizzle(sqlite);

console.log("Running migrations...");
migrate(db, { migrationsFolder: "drizzle/migrations" });
console.log("Migrations complete!");

sqlite.close();

// Main Hono app entry point
import { Hono } from "hono";
import { logger } from "hono/logger";
import app from "./routes";

const server = new Hono();

// Add logger middleware
server.use("*", logger());

// Mount routes
server.route("/", app);

const port = process.env.PORT || 3000;

console.log(`Starting server on http://localhost:${port}`);

export default {
  port,
  fetch: server.fetch,
};

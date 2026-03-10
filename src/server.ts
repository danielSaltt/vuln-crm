import { buildApp } from "./app";
import { env } from "./config/env";
import { connectRedis } from "./db/redis";
import { ensureSchema } from "./db/bootstrap";
import { seedIfNeeded } from "../scripts/seed-runtime";
import { info } from "./lib/logger";

async function start(): Promise<void> {
  await connectRedis();
  await ensureSchema();
  await seedIfNeeded();

  const app = await buildApp();
  app.listen(env.port, () => {
    info("Server started", { port: env.port, baseUrl: env.baseUrl });
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

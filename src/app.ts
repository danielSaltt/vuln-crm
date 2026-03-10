import express from "express";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs/promises";
import routes from "./routes";
import { sessionMiddleware } from "./middleware/session";
import { weakRateLimit } from "./middleware/rateLimit";
import { auditTrail } from "./middleware/audit";
import { errorMiddleware } from "./middleware/error";
import { env } from "./config/env";

export async function buildApp() {
  await fs.mkdir(env.uploadDir, { recursive: true });

  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "src", "views"));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.sessionSecret));
  app.use(weakRateLimit);
  app.use(sessionMiddleware);
  app.use("/static", express.static(path.join(process.cwd(), "src", "public")));
  app.use("/uploads", express.static(path.join(process.cwd(), env.uploadDir)));
  app.use(auditTrail);

  app.use(routes);
  app.use(errorMiddleware);

  return app;
}

import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL || "postgres://vuln:vuln@localhost:5432/vulncrm",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  sessionSecret: process.env.SESSION_SECRET || "changeme",
  seedOnStart: (process.env.SEED_ON_START || "true") === "true",
  baseUrl: process.env.BASE_URL || "http://localhost:4000",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  adminBootstrapToken: process.env.ADMIN_BOOTSTRAP_TOKEN || "debug-admin"
};

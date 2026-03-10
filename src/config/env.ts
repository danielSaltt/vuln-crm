import dotenv from "dotenv";

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "production",
  port: Number(process.env.PORT || 4000),
  databaseUrl: required("DATABASE_URL"),
  redisUrl: required("REDIS_URL"),
  sessionSecret: required("SESSION_SECRET"),
  seedOnStart: (process.env.SEED_ON_START || "true") === "true",
  baseUrl: process.env.BASE_URL || "https://temporary",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  adminBootstrapToken: process.env.ADMIN_BOOTSTRAP_TOKEN || "debug-admin",
};

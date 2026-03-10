import { createClient } from "redis";
import { env } from "../config/env";

export const redisClient = createClient({
  url: env.redisUrl
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

export async function closeRedis(): Promise<void> {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}

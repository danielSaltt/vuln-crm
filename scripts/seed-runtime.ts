import { env } from "../src/config/env";
import { seedAllFixtures } from "./seed-shared";

let seeded = false;

export async function seedIfNeeded(): Promise<void> {
  if (!env.seedOnStart || seeded) {
    return;
  }
  await seedAllFixtures();
  seeded = true;
}

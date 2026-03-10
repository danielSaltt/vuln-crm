import { ensureSchema } from "../src/db/bootstrap";
import { seedAllFixtures } from "./seed-shared";
import { closeDb } from "../src/db/postgres";

async function run() {
  await ensureSchema();
  const stats = await seedAllFixtures();
  console.log("Seed complete", stats);
  await closeDb();
}

run().catch(async (err) => {
  console.error(err);
  await closeDb();
  process.exit(1);
});

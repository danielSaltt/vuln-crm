import fs from "node:fs/promises";
import path from "node:path";

async function run() {
  const base = path.join(process.cwd(), "fixtures");
  const groups = await fs.readdir(base);
  let total = 0;

  for (const group of groups) {
    const entries = await fs.readdir(path.join(base, group));
    const count = entries.filter((entry) => entry.endsWith(".json")).length;
    total += count;
    console.log(`${group}: ${count}`);
  }

  console.log(`total fixture files: ${total}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

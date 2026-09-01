import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", ".data");
const LOG_PATH = path.join(DATA_DIR, "checkout-log.json");

async function ensureStore() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(LOG_PATH)) await writeFile(LOG_PATH, "[]", "utf-8");
}

export async function readCheckoutLog() {
  await ensureStore();
  const raw = await readFile(LOG_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function appendCheckoutEntries(entries) {
  await ensureStore();
  const existing = await readCheckoutLog();
  const updated = [...entries, ...existing]; // newest first
  await writeFile(LOG_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export async function clearCheckoutLog() {
  await ensureStore();
  await writeFile(LOG_PATH, "[]", "utf-8");
}

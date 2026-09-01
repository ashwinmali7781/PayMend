import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", ".data");
const LOG_PATH = path.join(DATA_DIR, "audit-log.json");

async function ensureStore() {
  if (!existsSync(DATA_DIR)) await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(LOG_PATH)) await writeFile(LOG_PATH, "[]", "utf-8");
}

export async function readAuditLog() {
  await ensureStore();
  const raw = await readFile(LOG_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function appendAuditEntries(entries) {
  await ensureStore();
  const existing = await readAuditLog();
  const updated = [...entries, ...existing]; // newest first
  await writeFile(LOG_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export async function clearAuditLog() {
  await ensureStore();
  await writeFile(LOG_PATH, "[]", "utf-8");
}

/**
 * Applies a human resolution to one escalated entry (approve a manual
 * retry, dismiss, or write off). This is the only place the audit log
 * is mutated after the fact - everything else is append-only - and the
 * mutation itself is logged as a resolution object, not a silent edit.
 */
export async function resolveEscalation(auditId, resolution) {
  await ensureStore();
  const log = await readAuditLog();
  const index = log.findIndex((e) => e.audit_id === auditId);
  if (index === -1) return null;

  log[index] = {
    ...log[index],
    resolution: {
      ...resolution,
      resolved_at: new Date().toISOString(),
    },
  };

  await writeFile(LOG_PATH, JSON.stringify(log, null, 2), "utf-8");
  return log[index];
}

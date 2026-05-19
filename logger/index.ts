import { appendFile, mkdir } from "fs/promises";
import path from "path";

const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIRECTORY, "app.log");

async function ensureLogDirectory() {
  try {
    await mkdir(LOG_DIRECTORY, { recursive: true });
  } catch (error) {
    console.error("Logger: failed to create logs directory", error);
  }
}

function formatValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

async function writeLog(level: string, message: unknown, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const formattedMessage = formatValue(message);
  const formattedMeta = meta !== undefined ? ` | ${formatValue(meta)}` : "";
  const logLine = `${timestamp} [${level}] ${formattedMessage}${formattedMeta}\n`;

  await ensureLogDirectory();
  try {
    await appendFile(LOG_FILE, logLine, "utf8");
  } catch (error) {
    console.error("Logger: failed to write log", error);
  }
}

export const logger = {
  info: async (message: unknown, meta?: unknown) => writeLog("INFO", message, meta),
  warn: async (message: unknown, meta?: unknown) => writeLog("WARN", message, meta),
  error: async (message: unknown, meta?: unknown) => writeLog("ERROR", message, meta),
};

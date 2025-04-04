import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}:\t${message}`;
});

// ✅ Info Transport (Only "info" logs)
const infoTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/info-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxFiles: "7d",
  level: "info", // ✅ Logs only "info" messages
  format: winston.format.combine(winston.format.timestamp(), customFormat),
});

// ✅ Error Transport (Only "error" logs)
const errorTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/error-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxFiles: "7d",
  level: "error", // ✅ Logs only "error" messages
  format: winston.format.combine(winston.format.timestamp(), customFormat),
});

// ✅ Create Logger WITHOUT Global Level
const logger = winston.createLogger({
  transports: [
    infoTransport,  // Handles only info logs
    errorTransport, // Handles only error logs
    new winston.transports.Console(), // Optional: Console logs
  ],
});

export default logger;

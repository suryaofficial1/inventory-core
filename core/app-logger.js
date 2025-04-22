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
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
});

// ✅ Error Transport (Only "error" logs)
const errorTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/error-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxFiles: "7d",
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    customFormat
  ),
});

// ✅ Create Logger WITHOUT Global Level
const logger = winston.createLogger({
  transports: [
    infoTransport,
    errorTransport,
  ],
});

// ✅ Add Console Transport separately with color and timestamp
logger.add(new winston.transports.Console({
  level: "debug", // Change to 'info' if you want fewer logs in console
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    customFormat
  ),
}));

export default logger;

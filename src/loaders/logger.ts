import winston from "winston";
import MongoTransport from "winston-mongodb";
import { configs } from "../configs";
import moment from "moment-timezone";

let transports: any = [
  new winston.transports.File({
    filename: `logs/error.log`,
    level: "error",
    options: { flags: "a", mode: 0o755 },
  }),
  new winston.transports.File({
    filename: `logs/combined.log`,
    options: { flags: "a", mode: 0o755 },
  }),
  new winston.transports.File({ filename: "logs/vnpost-error.log", level: "vnpost" }),
];
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  // transports.push(new MongoTransport.MongoDB({ db: configs.winston.db }));
  transports.push(
    new MongoTransport.MongoDB({
      db: configs.winston.db,
      collection: "errorlog",
      level: "error",
      tryReconnect: true,
    })
  );
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
}

if (process.env.NODE_ENV === "testing") {
  transports = [];
}

const Logger = winston.createLogger({
  level: configs.winston.level,
  levels: { ...winston.config.npm.levels, vnpost: 10 },
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

const timestampFormat = winston.format.timestamp({
  format: () => moment().format("YYYY-MM-DD HH:mm:ss"),
});
const simpleTimestampFormat = winston.format.combine(
  timestampFormat,
  winston.format.printf(({ level, message, timestamp, stack }) => {
    if (stack) {
      // print log trace
      return `${timestamp} ${level}: ${message} - ${stack}`;
    }
    return `[${timestamp}] ${level}: ${message}`;
  })
);
const errorFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  timestampFormat,
  winston.format.prettyPrint()
);
export { Logger, simpleTimestampFormat, timestampFormat, errorFormat };

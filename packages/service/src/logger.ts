import { uuidv4 } from "lib0/random";
import winston from "winston";
import { consoleFormat } from "winston-console-format";
import { NODE_ENV } from "./env";
const redact = require("redact-secrets")("[REDACTED]");
const CPU_ID = uuidv4().toString().substring(0, 4);

export const loggerMiddleware = (request, response, next) => {
  next();
  if ("on" in response) {
    response.on("finish", () =>
      requestLogger({
        request,
        service: "http",
        level: "info",
        status: response.statusCode,
      })
    );
  } else {
    requestLogger({
      request,
      service: "websocket",
      level: "info",
    });
  }
};

const loggerInstance = winston.createLogger(
  NODE_ENV === "production"
    ? {
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json(),
          winston.format((info) => {
            info.body = redact.map(JSON.parse(JSON.stringify(info.body)));
            return info;
          })(),
        ),
        transports: [
          new winston.transports.File({
            filename: "output.log",
          }),
        ],
      }
    : {
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          winston.format.padLevels(),
          winston.format((info) => {
            info.body = redact.map(JSON.parse(JSON.stringify(info.body)));
            return info;
          })(),

          consoleFormat({
            showMeta: true,
            metaStrip: ["timestamp", "service"],
            inspectOptions: {
              depth: Infinity,
              colors: true,
              maxArrayLength: Infinity,
              breakLength: 120,
              compact: Infinity,
            },
          })
        ),
        transports: [new winston.transports.Console()],
      }
);

export function requestLogger({ request, service, level, ...extra }) {
  loggerInstance[level || "info"](service, {
    level,
    cpu_id: CPU_ID,
    url: request.url,
    body: request.body,
    user: request.user,
    method: request.method,
    sessionID: request.sessionID,
    ...extra,
  });
}

export default function logger({ level, service, ...extra }) {
  loggerInstance[level || "info"](service, {
    level,
    cpu_id: CPU_ID,
    ...extra,
  });
}

import winston from "winston";

export const loggerMiddleware = (request, _, next) => {
  logger.log({
    url: request.url,
    level: "info",
    message: "request",
    user: request.user,
    method: request.method,
    "session-id": request.sessionID,
  });
  next();
};

export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export default logger;

import { HOST, PORT } from "./env";
import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";
import ws from "ws";
import Session from "./session";
import passport from "./utils/passport";
import { loggerMiddleware } from "./logger";

http.createServer(app);

const server = app.listen({ host: HOST, port: PORT });

console.log("Signaling server running on", HOST, ":", PORT);

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection-signaling", setupSignalingConnection);
wsServer.on("connection-provider", setupProviderConnection);

const wrapMiddleware = (middleware) => (request, next) =>
  middleware(request, {}, next);

const websocketMiddleware = (request, next) =>
  wrapMiddleware(Session)(request, () =>
    wrapMiddleware(passport.initialize())(request, () =>
      wrapMiddleware(passport.session())(request, () =>
        wrapMiddleware(loggerMiddleware)(request, next)
      )
    )
  );

server.on("upgrade", (request, socket, head) => {
  // only handle upgrade if path matches
  if (
    request.url.startsWith("/ws/provider") ||
    request.url.startsWith("/ws/signal")
  ) {
    websocketMiddleware(request, () => {
      wsServer.handleUpgrade(request, socket, head, (socket) => {
        if (request.url.startsWith("/ws/provider")) {
          wsServer.emit("connection-provider", socket, request);
        } else if (request.url.startsWith("/ws/signal")) {
          wsServer.emit("connection-signaling", socket, request);
        }
      });
    });
  }
});

import { HOST, PORT, SSL_OPTIONS } from "./env";
import http from "http";
import https from "https";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import ws from "ws";
import Session from "./session";
import passport from "./utils/passport";
import { loggerMiddleware } from "./logger";

if (SSL_OPTIONS) {
  https.createServer(SSL_OPTIONS, app);
} else {
  http.createServer(app);
}

const server = app.listen({ host: HOST, port: PORT });

console.log("Signaling server running on", HOST, ":", PORT);

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection-signaling", setupSignalingConnection);

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
  if (request.url.startsWith("/ws/signal")) {
    websocketMiddleware(request, () => {
      wsServer.handleUpgrade(request, socket, head, (socket) => {
        if (request.url.startsWith("/ws/signal")) {
          wsServer.emit("connection-signaling", socket, request);
        }
      });
    });
  }
});

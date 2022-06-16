import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";
import { HOST, PORT } from "./env";
import ws from "ws";

http.createServer(app);

const server = app.listen({ host: HOST, port: PORT });

console.log("Signaling server running on", HOST, ":", PORT);

const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection-signaling", setupSignalingConnection);
wsServer.on("connection-provider", setupProviderConnection);

server.on("upgrade", (request, socket, head) => {
  // only handle upgrade if path matches
  if (!request.url.startsWith("/ws/provider") && !request.url.startsWith("/ws/signal")) {
    return;
  }
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    if (request.url.startsWith("/ws/provider")) {
      wsServer.emit("connection-provider", socket, request);
    } else if (request.url.startsWith("/ws/signal")) {
      wsServer.emit("connection-signaling", socket, request);
    }
  });
});

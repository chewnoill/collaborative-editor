import http from "http";
import upgradeWebsockets from "./websocket-service";
import app from "./app";

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6001;

const server = http.createServer(app);

server.on("upgrade", upgradeWebsockets);

server.listen({ host, port });

console.log("Signaling server running on", host, ":", port);

import ws from 'ws'
import http from 'http'
import setupWSConnection from './socket-message-handling';

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 6001;
const wss = new ws.Server({ noServer: true });

const server = http.createServer((_, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  const handleAuth = (ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen({ host, port });

console.log("Signaling server running on", host, ":", port);

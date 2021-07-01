import ws from 'ws'
import http from 'http'

/**
 *
 * [`y-websocket`](https://github.com/yjs/y-websocket) provides a template
 * websocket services to interface with their websocket provider
 * https://github.com/yjs/y-websocket/blob/master/bin/server.js
 * 
 * [`y-webrtc`](https://github.com/yjs/y-webrtc) provides
 * a thin signalling backing service that connects to their
 * webrtc client provider https://github.com/yjs/y-webrtc/blob/master/bin/server.js 
 *
 * TODO: Build this. 
 * 
 * Functions from both services should be combined here, to produce
 * a single websocket connection that provides both websocket
 * push changes, and initial document loads, as well as connecting
 * peers to each other.
 * 
 * Data persistance.
 *   The y-websocket interface implements a leveldb data layer interface.
 *   * What is leveldb?
 *   * Implement connector to some docker database.
 */
 

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 6001;
// @ts-ignore
const wss = new ws.Server({ noServer: true });

const server = http.createServer((_, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", function(){
  console.log("made it here!");
});

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = (ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen({ host, port });

console.log("Signaling server running on", host, ":", port);

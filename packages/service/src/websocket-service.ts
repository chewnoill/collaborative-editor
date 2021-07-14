import ws from "ws";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";

const wss = new ws.Server({ noServer: true });
wss.on("connection-signaling", setupSignalingConnection);
wss.on("connection-provider", setupProviderConnection);

export default function upgradeWebsockets(request, socket, head) {
  if (request.url === "/signal") {
    wss.handleUpgrade(request, socket, head, (ws) =>
      wss.emit("connection-signaling", ws, request)
    );
  } else if (request.url.substring(0, 9) === "/provider") {
    wss.handleUpgrade(request, socket, head, (ws) =>
      wss.emit("connection-provider", ws, request)
    );
  }
}

import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";
import { HOST, PORT } from "./env";

http.createServer(app);

app.ws("/ws/signal", setupSignalingConnection);
app.ws("/ws/provider/*", setupProviderConnection);


app.listen({ host: HOST, port: PORT });

console.log("Signaling server running on", HOST, ":", PORT);

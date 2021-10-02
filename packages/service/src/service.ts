import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6001;

const server = http.createServer(app);

app.ws("/signal", setupSignalingConnection);
app.ws("/provider/*", setupProviderConnection);

app.listen({ host, port });

console.log("Signaling server running on", host, ":", port);

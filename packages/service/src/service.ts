import http from "http";
import app from "./app";
import setupSignalingConnection from "./utils/signaling-connection";
import setupProviderConnection from "./utils/provider-connection";

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 6001;

const server = http.createServer(app);

app.ws("/ws/signal", setupSignalingConnection);
app.ws("/ws/provider/*", setupProviderConnection);


app.listen({ host, port });

if(NODE_ENV === 'production'){
  app.listen({ host, port: 443 });
}

console.log("Signaling server running on", host, ":", port);

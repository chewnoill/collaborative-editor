import { decoding, encoding } from "lib0";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import logger from "../logger";
import { queue } from "../mq";
import { insertUpdate } from "./documents";
import { getYDoc } from "./ws-shared-doc";

const messageSync = 0;
const messageAwareness = 1;

const pingTimeout = 30000;

const providerMessageResolver = (conn, message, doc) => {
  const encoder = encoding.createEncoder();
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);
  switch (messageType) {
    case messageSync:
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.readSyncMessage(decoder, encoder, doc, null);
      if (encoding.length(encoder) > 1) {
        doc.send(conn, encoding.toUint8Array(encoder));
      } else {
        syncProtocol.writeSyncStep2(encoder, doc);
      }
      break;
    case messageAwareness: {
      awarenessProtocol.applyAwarenessUpdate(
        doc.awareness,
        decoding.readVarUint8Array(decoder),
        conn
      );
      break;
    }
  }
};

/**
 * Setup a new client
 * @param {any} conn
 * @param {any} req
 * @param {any} options
 */
const setupProviderConnection = async (
  conn,
  req,
  { docName = req.url.slice(1).split("/")[2], gc = true } = {}
) => {
  let closed = false;

  const doc = await getYDoc(docName, gc);
  doc.on("update", (update) => {
    insertUpdate(docName, update, {
      user_id: req.user?.id,
    }).then(() => {
      queue.add("update-document", { document_id: docName });
      queue.add("update-document-history", { document_id: docName });
    });
  });
  doc.conns.set(conn, new Set());

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        doc.closeConn(conn);
      }
      clearInterval(pingInterval);
    } else if (doc.conns.has(conn)) {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        doc.closeConn(conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("close", () => {
    doc.closeConn(conn);
    clearInterval(pingInterval);
  });

  conn.on(
    "message",
    /** @param {object} message */ (message) => {
      if (message && !closed) {
        logger({
          level: "info",
          service: "provider",
          data: message,
          document_id: docName,
        });
        providerMessageResolver(conn, new Uint8Array(message), doc);
      }
    }
  );

  {
    // send sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc as any);
    doc.send(conn, encoding.toUint8Array(encoder));
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys())
        )
      );
      doc.send(conn, encoding.toUint8Array(encoder));
    }
  }
};

export default setupProviderConnection;

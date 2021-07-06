import { decoding, encoding } from "lib0";
import * as map from "lib0/map";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import { getYDoc } from "./utils/ws-shared-doc";

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const messageSync = 0;
const messageAwareness = 1;

/**
 * Map froms topic-name to set of subscribed clients.
 * @type {Map<string, Set<any>>}
 */
const topics = new Map();

const pingTimeout = 30000;

/**
 * @param {any} conn
 * @param {object} message
 */
const send = (conn, message) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close();
  }
  try {
    conn.send(message);
  } catch (e) {
    conn.close();
  }
};

/**
 * Setup a new client
 * @param {any} conn
 */
const setupWSConnection = (
  conn,
  req,
  { docName = req.url.slice(1).split("?")[0], gc = true } = {}
) => {

  /**
   * @type {Set<string>}
   */
  const subscribedTopics = new Set();

  let closed = false;

  const doc = getYDoc(docName, gc);
  doc.conns.set(conn, new Set());

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
  }, pingTimeout);

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(conn);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  conn.on(
    "message",
    /** @param {object} message */ (message) => {
      if (message && !closed) {
        if (Buffer.isBuffer(message)) {
          message = new Uint8Array(message);
          const encoder = encoding.createEncoder();
          const decoder = decoding.createDecoder(message);
          const messageType = decoding.readVarUint(decoder);
          switch (messageType) {
            case messageSync:
              encoding.writeVarUint(encoder, messageSync);
              syncProtocol.readSyncMessage(decoder, encoder, doc, null);
              if (encoding.length(encoder) > 1) {
                doc.send(conn, encoding.toUint8Array(encoder));
              }
              // TODO:
              // doc is now the updated document
              // we need to figure out how to persist this
              break;
            case messageAwareness: {
              awarenessProtocol.applyAwarenessUpdate(
                doc.awareness,
                decoding.readVarUint8Array(decoder),
                conn
              );
              break;
            }
          };
        } else if (message.type) {
          message = JSON.parse(message);
          switch (message.type) {
            case "subscribe":
              /** @type {Array<string>} */ (message.topics || []).forEach(
                (topicName) => {
                  if (typeof topicName === "string") {
                    // add conn to topic
                    const topic = map.setIfUndefined(
                      topics,
                      topicName,
                      () => new Set()
                    );
                    topic.add(conn);
                    // add topic to conn
                    subscribedTopics.add(topicName);
                  }
                }
              );
              break;
            case "unsubscribe":
              /** @type {Array<string>} */ (message.topics || []).forEach(
                (topicName) => {
                  const subs = topics.get(topicName);
                  if (subs) {
                    subs.delete(conn);
                  }
                }
              );
              break;
            case "publish":
              if (message.topic) {
                const receivers = topics.get(message.topic);
                if (receivers) {
                  receivers.forEach((receiver) =>
                    send(receiver, JSON.stringify(message))
                  );
                }
              }
              break;
            case "ping":
              send(conn, JSON.stringify({ type: "pong" }));
          };
        }
      }
    }
  );

  {
    // send sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
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

export default setupWSConnection;

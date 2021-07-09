import * as map from "lib0/map";

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

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
const sendSignal = (conn, message) => {
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

const signalerMessageResolver = (conn, message, subscribedTopics) => {
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
            sendSignal(receiver, JSON.stringify(message))
          );
        }
      }
      break;
    case "ping":
      sendSignal(conn, JSON.stringify({ type: "pong" }));
  }
};

/**
 * Setup a new client
 * @param {any} conn
 */
const setupSignalingConnection = (conn) => {
  /**
   * @type {Set<string>}
   */
  const subscribedTopics = new Set();

  let closed = false;

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
        signalerMessageResolver(conn, JSON.parse(message), subscribedTopics);
      }
    }
  );
};

export default setupSignalingConnection;

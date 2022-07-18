import { encoding, mutex } from "lib0";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import { fetchDocument, updateDocumentContent } from "./documents";

const messageAwareness = 1;
const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

async function fetchYDoc(document_id) {
  const yDoc = new WSSharedDoc(document_id);
  const dbDoc = await fetchDocument(document_id);
  Y.applyUpdate(
    yDoc,
    Y.mergeUpdates([
      dbDoc.origin,
      ...dbDoc.document_updates.map((update) => update.document_update),
    ])
  );

  if (dbDoc.document_updates.length === 0) {
    // nothing to do
    return yDoc;
  }

  const latest_update_time =
    dbDoc.document_updates[dbDoc.document_updates.length - 1].created_at;

  await updateDocumentContent(
    document_id,
    yDoc.getText("codemirror").toJSON(),
    Buffer.from(Y.encodeStateAsUpdate(yDoc)),
    latest_update_time
  );
  return yDoc;
}

// We keep a set of documents in memory here.
const docs = new Map<string, WSSharedDoc>();

export const getYDoc = async (document_id, gc = true): Promise<WSSharedDoc> => {
  if (docs.has(document_id)) {
    return docs.get(document_id);
  }
  const doc = await fetchYDoc(document_id);
  doc.gc = gc;
  docs.set(document_id, doc);
  return doc;
};

export class WSSharedDoc extends Y.Doc {
  name: string;
  mux: any;
  conns: Map<any, any>;
  awareness: any;
  /**
   * @param {string} name
   */
  constructor(name) {
    super();
    this.name = name;
    this.mux = mutex.createMutex();

    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    this.conns = new Map();

    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awarenessProtocol.Awareness(this as any);
    this.awareness.setLocalState(null);

    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
      );
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        this.send(c, buff);
      });
    };
    this.awareness.on("update", awarenessChangeHandler);
  }

  send(conn, buff: Uint8Array) {
    if (
      conn.readyState !== wsReadyStateConnecting &&
      conn.readyState !== wsReadyStateOpen
    ) {
      this.closeConn(conn);
    }
    try {
      conn.send(buff, (err) => {
        err != null && this.closeConn(conn);
      });
    } catch (e) {
      this.closeConn(conn);
    }
  }

  closeConn(conn) {
    if (this.conns.has(conn)) {
      /**
       * @type {Set<number>}
       */
      // @ts-ignore
      const controlledIds = this.conns.get(conn);
      this.conns.delete(conn);
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        Array.from(controlledIds),
        null
      );
      if (this.conns.size === 0) {
        docs.delete(this.name);
      }
    }
    conn.close();
  }
}

import { encoding, mutex } from "lib0";
import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as map from "lib0/map";

const messageAwareness = 1;
const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

// We keep a set of documents in memory here.
const docs = new Map<string, WSSharedDoc>();

export const getYDoc = (docname, gc = true): WSSharedDoc =>
  // TODO: get ydoc from database
  //
  // this database ccall should be wrapped with
  // a Dataloader class 
  // see: https://www.npmjs.com/package/dataloader
  map.setIfUndefined(docs, docname, () => {
    const doc = new WSSharedDoc(docname);
    doc.gc = gc;
    docs.set(docname, doc);
    return doc;
  });

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
    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs =
          /** @type {Set<number>} */ this.conns.get(conn);
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
  // TODO: I think buff is the change we need to save
  // Do we care about duplicates?
  // can we detect duplicates?
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

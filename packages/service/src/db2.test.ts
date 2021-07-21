import { buffer } from "lib0";
import * as Y from "yjs";
import { db, pool, schema } from "./db";

// Attempted using a query data structure to automate randomized updates in different orders
// interface IQueue<T> {
//   enqueue(item: T): void;
//   dequeue(): T;
// }

// class Queue<T> implements IQueue<T> {
//   private storage: T[] = [];

//   constructor(private capacity: number = Infinity) {}

//   enqueue(item: T): void {
//     this.storage.push(item);
//   }
//   dequeue(): T | undefined {
//     return this.storage.shift();
//   }
// }

test("Create more updates to documents and apply the updates in different orders.", async () => {
  // create a yjs document
  const ydoc1 = new Y.Doc();
  const ydoc2 = new Y.Doc();

  // make "more" updates to the document (turn into some type of array)
  const ytext = ydoc1.getText("codemirror");
  const ytext2 = ydoc2.getText("codemirror");
  ytext.insert(0, "Hello, World!");
  ytext.insert(0, "This Change!");
  ytext2.insert(0, "MojoTech");
  ytext2.insert(0, "Something");

  const state = Y.encodeStateAsUpdate(ydoc1);
  const state2 = Y.encodeStateAsUpdate(ydoc2);

  // persist this change to the database
  const doc1 = await db
    .insert("document", {
      value: ytext.toJSON(),
      origin: Buffer.from(state),
      web_rtc_key: "",
    })
    .run(pool);
  const doc2 = await db
    .insert("document", {
      value: ytext2.toJSON(),
      origin: Buffer.from(state2),
      web_rtc_key: "",
    })
    .run(pool);

  // get change back from database
  const stateFromDatabase = await db
    .select("document", {
      id: doc1.id,
    })
    .run(pool);
  const stateFromDatabase2 = await db
    .select("document", {
      id: doc2.id,
    })
    .run(pool);

  // *** The following was produced by Tucker to calculate the differences of edits and compare ***

  // calculate differences
  const stateVector1 = Y.encodeStateVectorFromUpdate(
    db.toBuffer(stateFromDatabase[0].origin)
  );
  const stateVector2 = Y.encodeStateVectorFromUpdate(
    db.toBuffer(stateFromDatabase2[0].origin)
  );
  const diff1 = Y.diffUpdate(state, stateVector2);
  const diff2 = Y.diffUpdate(state2, stateVector1);

  // sync clients control ordering
  const intermediateState1 = Y.mergeUpdates([state, diff2]);
  const finalState1 = Y.mergeUpdates([intermediateState1, diff1]);

  // sync clients reversed
  const intermediateState2 = Y.mergeUpdates([state2, diff1]);
  const finalState2 = Y.mergeUpdates([intermediateState2, diff2]);

  expect(finalState1.toString()).toBe(finalState2.toString());
});

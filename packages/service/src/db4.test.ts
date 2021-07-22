import * as Y from "yjs";
import { db, pool, schema } from "./db";

test("join test", async () => {
  // create a yjs document A
  const ydoc = new Y.Doc();

  // make a change to first  document
  const ytext = ydoc.getText("codemirror");
  ytext.insert(0, "hello world");
  const state = Y.encodeStateAsUpdate(ydoc);

  // persist original document to the database
  const doc = await db
    .insert("document", {
      value: ytext.toJSON(),
      origin: Buffer.from(state),
      web_rtc_key: "",
    })
    .run(pool);
  // console.log(doc);

  // update the document
  ytext.insert(0, "New line.");
  const updated_state = Y.encodeStateAsUpdate(ydoc);

  // get change back from database (review if this is even necessary)
  const stateFromDatabase = await db
    .select("document", {
      id: doc.id,
    }).run(pool);

  // calculate differences
  const stateVector = Y.encodeStateVectorFromUpdate(db.toBuffer(stateFromDatabase[0].origin));
  const diff = Y.diffUpdate(updated_state, stateVector);

  // populate update table for updated changes to the document
  await db
    .insert("document_updates_queue", {
      id: doc.id,
      document_id: doc.id,
      document_update: Buffer.from(diff),
      update_time: new Date(),
    })
    .run(pool);
  // console.log(update);

  // Query that joins Documents (origin) table with Updates table (set of updates; implemented by Tucker)
  const documentUpdates = await db.sql<schema.document.SQL | schema.document_updates_queue.SQL, schema.document_updates_queue.JSONSelectable>`
  SELECT ${"document"}.*, ${"document_updates_queue"}.* FROM ${"document"} INNER JOIN ${"document_updates_queue"} 
  ON ${"document"}.${"id"} = ${"document_updates_queue"}.${"document_id"}
  GROUP BY ${"document"}.${"id"}, ${"document_updates_queue"}.${"id"}`.run(pool);

  // console.log(documentUpdates);

  // await db.sql`DELETE FROM ${"document_updates_queue"}`.run(pool);
  // await db.sql`DELETE FROM ${"document"}`.run(pool);
  console.log("Document Updates", documentUpdates);

  // test the result - [TO BE FIXED]
  expect(documentUpdates).toBe(diff);
});

import * as Y from "yjs";
import { db, pool, schema } from "./db";

test("crdts can be persisted", async () => {
  // create a yjs document A
  const ydoc = new Y.Doc();
  // make a change to the document
  const ytext = ydoc.getText("codemirror");
  ytext.insert(0, "hello world");
  const state = Y.encodeStateAsUpdate(ydoc);

  // persist this change to the database
  const doc = await db
    .insert("document", {
      value: ytext.toJSON(),
      origin: Buffer.from(state),
      web_rtc_key: "",
    })
    .run(pool);

  // const x: schema.document.Insertable = {
  //   value: ytext.toJSON(),
  //   origin: Buffer.from(state),
  //   web_rtc_key: "",
  // };
  // const doc = await db.sql<schema.document.SQL, schema.document.JSONSelectable>`INSERT INTO ${"document"} (${db.cols(x)}) VALUES (${db.vals(x)})`.run(
  //   pool
  // );
  // console.log(doc);

  // get the change back from the database
  const stateFromDatabase = await db
    .select("document", {
      id: doc.id,
    })
    .run(pool);

  // Question: What is the difference between the shortcut select query and the SQL select query? SQL query does not work.
  // const stateFromDatabase = await db.sql<schema.document.SQL, schema.document.JSONSelectable[]>`SELECT * FROM ${"document"} WHERE ${{id: doc.id}}`.run(pool);
  // console.log(stateFromDatabase);

  // create yjs document B from database change
  const ydoc2 = new Y.Doc();
  Y.applyUpdate(ydoc2, db.toBuffer(stateFromDatabase[0].origin));

  // expect that the contents of document A matches document B
  // test the result
  expect(ydoc.getText("codemirror").toJSON()).toBe(
    ydoc2.getText("codemirror").toJSON()
  );
});

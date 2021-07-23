import * as Y from "yjs";
import { pool, db } from "./db";
import { createDocument, insertUpdate } from "./utils/documents";
import { getYDoc } from "./utils/ws-shared-doc";

afterAll(() => {
  return pool.end();
});

test("crdts can be persisted", async () => {
  // create a yjs document A
  const ydoc = new Y.Doc();
  const ytext = ydoc.getText("codemirror");
  ytext.insert(0, "hello world");
  const { id, origin } = await createDocument(ydoc);
  // make a change to the document
  ytext.insert(0, "some new text");
  // persist this change to the database
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, db.toBuffer(origin)));
  // get the change back from the database
  const ydocUpdate = await getYDoc(id);

  // expect that the contents of document A matches document B
  expect(ytext.toJSON()).toMatch(ydocUpdate.getText("codemirror").toJSON());
});

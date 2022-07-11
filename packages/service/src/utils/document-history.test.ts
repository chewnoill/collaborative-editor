import * as Y from "yjs";
import { pool, db } from "../db";
import { createDocument, insertUpdate } from "./documents";
import {
  buildDocumentHistoryBuckets,
  fetchDocumentHistoryBuckets,
  getDocumentHistoryFromTable,
  replaceDocumentHistory,
} from "./document-history";

afterAll(() => {
  return pool.end();
});

async function testFixtures() {
  const user_a = await db.upsert("users", { name: "User A" }, "name").run(pool);
  const user_b = await db.upsert("users", { name: "User B" }, "name").run(pool);

  const ydoc = new Y.Doc();
  const ytext = ydoc.getText("codemirror");
  const { id } = await createDocument(pool, {
    creator_id: user_a.id,
    name: "test document",
    doc: ydoc,
  });

  let origin = Y.encodeStateVector(ydoc);
  ytext.insert(0, "hello world");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(100, "user b here to write");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(10, "Second Update");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
  });
  ytext.insert(40, "user a second Update");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
  });
  ytext.insert(60, "aowejfoaiewjf");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
  });
  ytext.insert(0, "#YOOOOO\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin));
  return { id };
}

test("document history can be generated", async () => {
  // create a yjs document A
  const { id } = await testFixtures();
  const id_obj = { id: id };
  const history = await buildDocumentHistoryBuckets(id_obj);

  history.forEach((value, i) =>
    expect({
      ...value,
      user_id: value.user_id || "",
    }).toMatchSnapshot({
      user_id: expect.any(String),
      document_id: expect.any(String),
    })
  );
});

test("document history replaced in table", async () => {
  const { id } = await testFixtures();
  const id_obj = { id: id };
  await replaceDocumentHistory(id_obj);
  const tableHistory = await getDocumentHistoryFromTable(id_obj.id);
  tableHistory.forEach((value, i) =>
    expect({
      ...value,
      user_id: value.user_id || "",
    }).toMatchSnapshot({
      user_id: expect.any(String),
      document_id: expect.any(String),
      id: expect.any(String),
    })
  );
});

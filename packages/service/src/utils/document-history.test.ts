import * as Y from "yjs";
import { pool, db } from "../db";
import { createDocument } from "./documents";
import {
  buildDocumentHistoryBuckets,
  getDocumentHistoryFromTable,
  replaceDocumentHistory,
} from "./document-history";

afterAll(() => {
  return pool.end();
});

function insertUpdate(
  document_id: string,
  document_update: Uint8Array,
  {
    user_id,
    created_at = new Date(),
  }: { user_id?: string; created_at?: Date } = {}
) {
  return db
    .insert("document_updates_queue", {
      user_id,
      document_id,
      document_update: Buffer.from(document_update),
      created_at,
    })
    .run(pool);
}

const INTERVAL = 60 * 1000;

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
  const start_date = new Date();

  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
    created_at: start_date,
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(100, "user b here to write");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
    created_at: new Date(start_date.getTime() + INTERVAL),
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(10, "Second Update");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 2),
  });
  ytext.insert(40, "user a second Update");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 3),
  });
  ytext.insert(60, "aowejfoaiewjf");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 4),
  });
  ytext.insert(0, "#YOOOOO\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    created_at: new Date(start_date.getTime() + INTERVAL * 5),
  });
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

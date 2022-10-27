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
    .insert("app.document_updates_queue", {
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

  const start_date = new Date();

  const { id } = await createDocument(pool, {
    creator_id: user_a.id,
    name: "test document",
    doc: ydoc,
    latest_update_time: new Date(start_date.getTime() - 2 * INTERVAL),
  });

  function getValue(ydoc: Y.Doc) {
    return ydoc.getText("codemirror").toJSON();
  }

  let origin = Y.encodeStateVector(ydoc);
  ytext.insert(0, "hello world\n");

  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
    created_at: start_date,
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(getValue(ydoc).length, "user b here to write\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_b.id,
    created_at: new Date(start_date.getTime() + INTERVAL),
  });
  origin = Y.encodeStateVector(ydoc);
  ytext.insert(getValue(ydoc).length, "Second Update\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 2),
  });
  ytext.insert(getValue(ydoc).length, "user a second Update\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 3),
  });
  ytext.insert(getValue(ydoc).length, "\n\naowejfoaiewjf\n");
  await insertUpdate(id, Y.encodeStateAsUpdate(ydoc, origin), {
    user_id: user_a.id,
    created_at: new Date(start_date.getTime() + INTERVAL * 4),
  });
  ytext.insert(0, "# YOOOOO\n\n");
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

  history.documentHistory.forEach((value, i) =>
    expect({
      ...value,
      user_id: value.user_id || "",
    }).toMatchSnapshot({
      user_id: expect.any(String),
      document_id: expect.any(String),
    })
  );
});

test.skip("document history replaced in table", async () => {
  const { id } = await testFixtures();
  const id_obj = { id: id };
  await replaceDocumentHistory(id_obj);
  const tableHistory = await getDocumentHistoryFromTable(id_obj.id);
  tableHistory.forEach((value, i) =>
    expect({
      ...value,
    }).toMatchSnapshot({
      document_id: expect.any(String),
    })
  );
});

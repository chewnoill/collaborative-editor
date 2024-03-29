import * as Y from "yjs";
import { pool, db } from "./db";
import {
  buildYDoc,
  createDocument,
  fetchDocument,
  insertUpdate,
  selectUserDocuments,
} from "./utils/documents";

afterAll(() => {
  return pool.end();
});

async function testFixtures() {
  const user = await db
    .upsert("app.user", { name: "test user" }, "name")
    .run(pool);

  return {
    user,
  };
}

test("crdts can be persisted", async () => {
  // create a yjs document A
  const { user } = await testFixtures();
  const ydoc = new Y.Doc();
  const ytext = ydoc.getText("codemirror");
  ytext.insert(0, "hello world");
  const { id, origin } = await createDocument(pool, {
    creator_id: user.id,
    name: "",
    doc: ydoc,
  });
  // make a change to the document
  ytext.insert(0, "some new text");
  // persist this change to the database
  await insertUpdate(
    id,
    Buffer.from(Y.encodeStateAsUpdate(ydoc, db.toBuffer(origin)))
  ).run(pool);
  // get the change back from the database
  const ydocUpdate = await fetchDocument(id).then(buildYDoc);

  // expect that the contents of document A matches document B
  expect(ytext.toJSON()).toMatch(ydocUpdate.getText("codemirror").toJSON());
});

test("users cannot see each other's documents", async () => {
  const user_a = await db
    .upsert("app.user", { name: "test user a" }, "name")
    .run(pool);
  const user_b = await db
    .upsert("app.user", { name: "test user b" }, "name")
    .run(pool);
  // create a yjs document A
  const ydoc = new Y.Doc();
  const { id: id_a } = await createDocument(pool, {
    name: "",
    creator_id: user_a.id,
  });

  const docs_b = await selectUserDocuments(user_b);
  expect(docs_b.findIndex((doc) => doc.id === id_a)).toBe(-1);
  const docs_a = await selectUserDocuments(user_a);
  expect(docs_a.findIndex((doc) => doc.id === id_a)).toBeGreaterThan(-1);
});

test("users can see documents that have been shared with them", async () => {
  const user_a = await db
    .upsert("app.user", { name: "test user a" }, "name")
    .run(pool);
  const user_b = await db
    .upsert("app.user", { name: "test user b" }, "name")
    .run(pool);
  // create a yjs document A
  const ydoc = new Y.Doc();
  const { id: id_a } = await createDocument(pool, {
    name: "",
    creator_id: user_a.id,
  });

  const docs_b = await selectUserDocuments(user_b);
  expect(docs_b.findIndex((doc) => doc.id === id_a)).toBe(-1);
  const docs_a = await selectUserDocuments(user_a);
  expect(docs_a.findIndex((doc) => doc.id === id_a)).toBeGreaterThan(-1);
});

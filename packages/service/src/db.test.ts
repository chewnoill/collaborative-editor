import * as Y from "yjs";
import db from "./utils/db";

afterAll(() => {
  db.$disconnect();
});

test("user can be created", async () => {
  // create a user
  const user = await db.users.create({
    data: {
      name: "test user",
    },
  });
  expect(user.name).toBe("test user");

  // read the created user entry
  const sameUser = await db.users.findFirst({
    where: {
      id: user.id,
    },
  });
  expect(user).toEqual(sameUser);
});

test("crdts can be persisted", async () => {
  // create a yjs document A
  const ydoc = new Y.Doc();
  // make a change to the document
  const ytext = ydoc.getText("codemirror");
  ytext.insert(0, "hello world");
  const state = Y.encodeStateAsUpdate(ydoc);

  // persist this change to the database
  const dbDoc = await db.document.create({
    data: {
      value: "test value",
      origin: Buffer.from(state),
      web_rtc_key: "",
    },
  });

  // get the change back from the database
  const stateFromDatabase = (
    await db.document.findFirst({
      where: {
        id: dbDoc.id,
      },
    })
  ).origin;

  // create yjs document B from database change
  const ydoc2 = new Y.Doc();
  Y.applyUpdate(ydoc2, stateFromDatabase);

  // expect that the contents of document A matches document B
  // test the result
  expect(ydoc.getText("codemirror").toJSON()).toBe(
    ydoc2.getText("codemirror").toJSON()
  );
});

test("document updates can be persisted", async () => {
  // create a yjs document A
  const ydoc = new Y.Doc();
  const originalState = Y.encodeStateAsUpdate(ydoc);
  // make a change to the document
  const ytext = ydoc.getText("codemirror");

  // create a document to associate updates with
  const dbDoc = await db.document.create({
    data: {
      value: "test value",
      origin: Buffer.from(originalState),
      web_rtc_key: "",
    },
  });

  // create and persist update encodings
  ytext.insert(0, "hello world");
  const updatedState1 = Y.encodeStateAsUpdate(
    ydoc,
    Y.encodeStateVectorFromUpdate(originalState)
  );
  await db.document_updates_queue.create({
    data: {
      document_id: dbDoc.id,
      document_update: Buffer.from(updatedState1),
    },
  });
  ytext.insert(0, "foo bar");
  const updatedState2 = Y.encodeStateAsUpdate(
    ydoc,
    Y.encodeStateVectorFromUpdate(updatedState1)
  );
  await db.document_updates_queue.create({
    data: {
      document_id: dbDoc.id,
      document_update: Buffer.from(updatedState2),
    },
  });
  ydoc.destroy();

  // get the updates back from the database
  const updatesFromDatabase = await db.document_updates_queue.findMany({
    where: {
      document_id: dbDoc.id,
    },
  });

  // create final state representations
  const finalState1 = Y.mergeUpdates([
    originalState,
    updatedState1,
    updatedState2,
  ]);
  let finalState2 = originalState;
  updatesFromDatabase.forEach(
    (update) =>
      (finalState2 = Y.mergeUpdates([finalState2, update.document_update]))
  );

  // expect final state created in memory to match
  // final state created from database contents
  expect(finalState1.toString()).toBe(finalState2.toString());
});

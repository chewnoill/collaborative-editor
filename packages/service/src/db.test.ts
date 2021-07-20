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

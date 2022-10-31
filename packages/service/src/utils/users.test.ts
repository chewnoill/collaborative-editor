import { createTestUser } from "../test/fixtures";
import { pool, db } from "./../db";
import { createUser, selectUsers, validateUser } from "./users";

afterAll(() => {
  return pool.end();
});

// test("creating a user", async () => {
//   const user = await createUser({ name: "Toby Savage 2", password: "12345" });
//   expect(user).toBeDefined();
// });

test("validate a user", async () => {
  await createTestUser("Toby Savage 2", "12345");
  const user = await validateUser({
    name: "Toby Savage 2",
    password: "12345",
  });
  expect(user).toBeDefined();
});

// test("validate a user", async () => {
//   const users = await selectUsers();
//   console.log(users);
//   expect(users).toBeDefined();
// });

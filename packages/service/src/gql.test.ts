import * as Y from "yjs";
import request from "supertest";
import app from "./app";
import { db, pool } from "./db";
import { createDocument } from "./utils/documents";

describe("Test a 200", () => {
  test("It should respond with a 200 status", async () => {
  const user_a = await db
    .upsert("users", { name: "test user a" }, "name")
    .run(pool);
  // create a yjs document A
  const ydoc = new Y.Doc();
  const { id: id_a } = await createDocument({ doc: ydoc, user: user_a });


    const auth = await login(user_a.name);
    const response = await request(app)
      .post("/graphql")
      .set("cookie", auth)
      .send({
        operationName: "MyQuery",
        query: `
query MyQuery {
  allDocuments {
    edges {
      node {
	      id
      }
    }
  }
}`,
        variables: null,
      });
      console.log(response.text);
    expect(response.statusCode).toBe(200);
  });
});

async function login(name: string) {
  const loginResponse: Response = await request(app)
    .post("/auth/login")
    .send({ username: name, password: "123" });
  return loginResponse.headers["set-cookie"];
}

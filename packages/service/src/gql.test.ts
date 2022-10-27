import request from "supertest";
import app from "./app";
import { db, pool } from "./db";
import { createDocument } from "./utils/documents";

let agent;

beforeAll(function () {
  agent = request.agent(app);
});

describe.skip("User Access", () => {
  test("can access their own documents", async () => {
    const user_a = await db
      .upsert("app.user", { name: "test user a" }, "name")
      .run(pool);
    // get login tokens
    await login(user_a.name);

    const user_a_document = await createDocument(pool, {
      creator_id: user_a.id,
      name: "",
    });
    // make query
    const response = await agent.post("/api/graphql").send({
      operationName: "DocumentTest",
      query: `
query DocumentTest($id: UUID!) {
  allDocuments {
    totalCount
  }
  documentById(id: $id) {
    id
  }
  me {
    id
    name
  }
}`,
      variables: { id: user_a_document.id },
    });

    const value = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(value.data.documentById.id).toBe(user_a_document.id);
  });
  test("can not access other users documents", async () => {
    const user_a = await db
      .upsert("app.user", { name: "test user a" }, "name")
      .run(pool);
    // get login tokens
    await login(user_a.name);
    const user_b = await db
      .upsert("app.user", { name: "test user b" }, "name")
      .run(pool);
    const user_b_document = await createDocument(pool, {
      creator_id: user_b.id,
      name: "",
      is_public: false,
    });
    // make query
    const response = await agent.post("/api/graphql").send({
      operationName: "DocumentTest",
      query: `
query DocumentTest($id: UUID!) {
  documentById(id: $id) {
    id
  }
}`,
      variables: { id: user_b_document.id },
    });

    const value = JSON.parse(response.text);
    expect(response.statusCode).toBe(200);
    expect(value.data.documentById).toBe(null);
  });
});

async function login(name: string) {
  await agent.post("/login").send({ username: name, password: "password" });
}

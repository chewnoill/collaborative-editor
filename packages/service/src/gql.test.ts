import request from "supertest";
import app from "./app";

describe("Test a 200", () => {
  test("It should respond with a 200 status", async () => {
    const response = await request(app)
      .post("/graphql")
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
    expect(response.statusCode).toBe(200);
  });
});

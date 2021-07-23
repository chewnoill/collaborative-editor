import { db, pool, schema } from "../db";

export function createUser(props: { name: string }) {
  return db.upsert("users", props, "name").run(pool);
}

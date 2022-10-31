import { db, pool, schema } from "../db";

export async function createTestUser(name, password="password"): Promise<schema.app.user.Selectable> {
  return db.sql`
INSERT INTO ${"app.user"} ("name", "password")
VALUES (${db.param(name)}, crypt(${db.param(password)}, gen_salt('md5')))
ON CONFLICT ("name") DO UPDATE
SET (${"name"}) = ROW(EXCLUDED.${"name"})
RETURNING to_jsonb(${"app.user"}.*) AS result`.run(pool).then(values=>values[0].result);
}

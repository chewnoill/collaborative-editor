export * as db from "zapatos/db";
import type * as schema from "zapatos/schema";
import url from "whatwg-url";
import Pool from "pg-pool";
export { schema };

const DATABASE_URL = process.env.DATABASE_URL;

const params = url.parseURL(DATABASE_URL);

const config = {
  user: params.username,
  password: params.password,
  host: params.host,
  port: params.port,
  database: params.path[0],
};

export const pool = new Pool(config);

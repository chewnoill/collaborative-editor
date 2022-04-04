export const NODE_ENV = process.env.NODE_ENV || "production";
export const HOST = process.env.HOST || "0.0.0.0";
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6001;

const LOCALHOST_DB_URL =
  "postgres://postgres:password@127.0.0.1:5432/postgres?sslmode=disable";
export const DATABASE_URL = process.env.DATABASE_URL || LOCALHOST_DB_URL;

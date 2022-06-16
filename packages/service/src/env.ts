import url from "whatwg-url";

export const NODE_ENV = process.env.NODE_ENV || "production";
export const HOST = process.env.HOST || "0.0.0.0";
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 6001;

export const DATABASE_URL = process.env.DATABASE_URL;

try {
  url.parseURL(DATABASE_URL);
} catch {
  throw `Invalid DATABASE_URL config`;
}

const REDIS_URL = process.env.REDIS_URL;

try {
  url.parseURL(REDIS_URL);
} catch {
  throw `Invalid REDIS_URL config`;
}

function redisConfig(urlString: string) {
  const params = url.parseURL(urlString);
  return {
    connection: {
      port: params.port,
      host: params.host,
      user: params.username,
      password: params.password,
    },
  };
}

export const REDIS_CONFIG = redisConfig(REDIS_URL);

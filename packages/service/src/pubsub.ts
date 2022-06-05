import Redis from "ioredis";
import { REDIS_CONFIG } from "./env";

export const pub = new Redis(REDIS_CONFIG.connection);
export const sub = new Redis(REDIS_CONFIG.connection);

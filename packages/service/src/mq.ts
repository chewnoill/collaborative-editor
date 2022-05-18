import { Queue } from "bullmq";
import { REDIS_CONFIG } from "./env";

export const queue = new Queue("q", REDIS_CONFIG);

import url from "whatwg-url";
import { Queue } from 'bullmq'
import { REDIS_URL } from './env';

const params = url.parseURL(REDIS_URL);

const connection = {
  connection: {
    host: params.host,
    port: params.port,
  },
};

export const queue = new Queue('q', connection);

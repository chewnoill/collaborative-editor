import { Worker, Job, QueueScheduler } from "bullmq";
import workers from "./worker";
import url from "whatwg-url";
import { REDIS_URL } from "./env";

const params = url.parseURL(REDIS_URL);

const connection = {
  connection: {
    host: params.host,
    port: params.port,
  },
};

const worker = new Worker(
  "q",
  async (job) => {
    if (workers[job.name]) {
      workers[job.name].run(job);
    } else {
      console.log(`unknown jobtype: ${job.name}`);
    }
  },
  connection
);

// start a schedular, which enabled retrys and repeatable jobs
new QueueScheduler("q", connection);

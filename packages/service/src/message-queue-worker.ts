import { Worker, Job } from "bullmq";
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
    console.log(`starting ${job.name}`);
  },
  connection
);

worker.on("drained", () => {
  console.log("drained");
});
worker.on("completed", (job: Job) => {
  console.log("completed", job.name);
});
worker.on("failed", (job: Job) => {
  console.log("failed", job.name);
});

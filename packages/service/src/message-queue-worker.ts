import { Worker, QueueScheduler } from "bullmq";
import workers from "./worker";
import { REDIS_CONFIG } from "./env";
import logger from "./logger";

async function main() {
  const worker = new Worker(
    "q",
    async (job) => {
      if (workers[job.name]) {
        workers[job.name].run(job);
      } else {
        logger({
          level: "warn",
          service: "update-document-history",
          message: `unknown jobtype: ${job.name}`,
        });
      }
    },
    REDIS_CONFIG
  );

  worker.on("completed", (job) => {
    logger({
      level: "info",
      service: "update-document-history",
      message: `${job.name} completed`,
      body: job.data,
    });
  });
  worker.on("failed", ({ id, name, failedReason }) => {
    logger({
      level: "error",
      service: "update-document-history",
      message: `${name} failed, ${id}`,
      failedReason,
    });
  });

  worker.on("progress", ({ id, name, data }) => {
    logger({
      level: "info",
      service: "update-document-history",
      message: `${name} progress, ${id}`,
      data,
    });
  });

  // start a schedular, which enabled retrys and repeatable jobs
  new QueueScheduler("q", REDIS_CONFIG);
}

main();

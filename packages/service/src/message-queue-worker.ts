import { Worker, QueueScheduler } from "bullmq";
import workers from "./worker";
import { REDIS_CONFIG } from "./env";

async function main() {
  const worker = new Worker(
    "q",
    async (job) => {
      if (workers[job.name]) {
        workers[job.name].run(job);
      } else {
        console.log(`unknown jobtype: ${job.name}`);
      }
    },
    REDIS_CONFIG
  );

  // start a schedular, which enabled retrys and repeatable jobs
  new QueueScheduler("q", REDIS_CONFIG);
}

main();

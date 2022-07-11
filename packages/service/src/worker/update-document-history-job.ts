import * as Y from "yjs";
import { pool, db } from "../db";
import gitDiff from "git-diff";
import { queue } from "../mq";
import {
  fetchDocument,
  selectAllUpdatedDocuments,
  updateDocumentContent,
} from "../utils/documents";

import { replaceDocumentHistory } from "../utils/document-history";

const config = {
  key: "update-document-history",
  run: async function updateDocumentHistory(job) {
    const updatableDocuments = await selectAllUpdatedDocuments();
    if (updatableDocuments.length === 0) {
      console.log("nothing to update in history job");
      return;
    }
    await Promise.all(updatableDocuments.map(replaceDocumentHistory));
  },
};

export default config;

async function setupRepeatableJobs() {
  await queue.add(
    config.key,
    {},
    {
      repeat: {
        cron: "*/1 * * * *",
      },
    }
  );
}
setupRepeatableJobs();

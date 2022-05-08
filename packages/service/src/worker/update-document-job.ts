import * as Y from "yjs";
import { db } from "../db";
import { queue } from "../mq";
import {
  fetchDocument,
  selectAllUpdatedDocuments,
  updateDocumentContent,
} from "../utils/documents";

const config = {
  key: "update-document",
  run: async function updateDocument(job) {
    const updatableDocuments = await selectAllUpdatedDocuments();
    if(updatableDocuments.length === 0) {
        console.log('nothing to update')
        return;
    }
    await Promise.all(updatableDocuments.map(updateSingleDocument));
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

async function updateSingleDocument({ id: document_id }: { id: string }) {
  const yDoc = new Y.Doc();
  const dbDoc = await fetchDocument(document_id);
  Y.applyUpdate(
    yDoc,
    Y.mergeUpdates([
      dbDoc.origin,
      ...dbDoc.document_updates.map((update) => update.document_update),
    ])
  );

  if (dbDoc.document_updates.length === 0) {
    // nothing to do?
    console.log("why am I here?")
    return yDoc;
  }

  const latest_update = dbDoc.document_updates[dbDoc.document_updates.length - 1];

  const updatedDoc = await updateDocumentContent(
    document_id,
    yDoc.getText("codemirror").toJSON(),
    Buffer.from(Y.encodeStateAsUpdate(yDoc)),
    db.sql`(select ${"created_at"} from ${"document_updates_queue"} where ${"document_updates_queue"}.${"id"} = ${db.param(latest_update.id)})`
  );

  return yDoc;
}

import * as Y from "yjs";
import { db } from "../db";
import logger from "../logger";
import { queue } from "../mq";
import { fetchDocument, updateDocumentContent } from "../utils/documents";

const config = {
  key: "update-document",
  run: async function updateDocument(params: { data: { document_id } }) {
    if (!params?.data?.document_id) {
      logger({
        level: "warn",
        service: "update-document",
        message: "invalid params",
        body: params,
      });
      return;
    }
    try {
      await updateSingleDocument(params.data.document_id);
    } catch (error) {
      logger({ level: "error", service: "update-document", error });
    }
  },
};

export default config;

async function updateSingleDocument(document_id: string) {
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
    logger({
      level: "warn",
      service: "update-document",
      message: "nothing to update",
      body: {
        document_id,
      },
    });
    return;
  }

  const latest_update =
    dbDoc.document_updates[dbDoc.document_updates.length - 1];
  const content = yDoc.getText("codemirror").toJSON();

  logger({
    level: "info",
    service: "update-document",
    message: `${dbDoc.document_updates.length} updates`,
    body: {
      document_id,
      content,
    },
  });

  await updateDocumentContent(
    document_id,
    content,
    Buffer.from(Y.encodeStateAsUpdate(yDoc)),
    db.sql`(select ${"created_at"} from ${"document_updates_queue"} where ${"document_updates_queue"}.${"id"} = ${db.param(
      latest_update.id
    )})`
  );
  const jobs = await queue.getJobs(['waiting','active']);
  if (
    jobs.find(
      (job) =>
        job.name === "update-document-history" &&
        job.data.document_id === document_id
    )
  )
    return;

  await queue.add("update-document-history", { document_id: document_id });
}

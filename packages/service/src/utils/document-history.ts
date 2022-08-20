import * as Y from "yjs";
import { pool, db } from "../db";
import gitDiff from "git-diff";

//select changes in document_updates_queue
export async function fetchDocumentHistoryBuckets(document_id: string) {
  const buckets = await db.sql`
SELECT
  to_timestamp (extract ('epoch' from created_at)::int/60*60) as timeslice,
  user_id,
  array_agg(
    jsonb_build_object(
        'id',document_updates_queue.id,
        'update', document_update
  )) AS bucket
from ${"app.document_updates_queue"}
left join ${"app.user"} on ${"app.document_updates_queue"}.user_id = ${"app.user"}.id
where document_id = ${db.param(document_id)}
group by timeslice, user_id
order by timeslice ASC
`.run(pool);

  return buckets;
}

export async function replaceDocumentHistory(document) {
  const { documentHistory, documentUpdateDocumentHistory } =
    await buildDocumentHistoryBuckets(document);
  await db.serializable(pool, async (txnClient) => {
    await db
      .deletes("app.document_history", {
        document_id: document.id,
      })
      .run(txnClient);

    await db.insert("app.document_history", documentHistory).run(txnClient);
    await db
      .insert(
        "app.document_update_document_history",
        documentUpdateDocumentHistory
      )
      .run(txnClient);
  });
}

export async function buildDocumentHistoryBuckets({
  id: document_id,
}: {
  id: string;
}) {
  const ydoc = new Y.Doc();
  const bucket_history = (
    await fetchDocumentHistoryBuckets(document_id)
  ).reduce(
    (
      { documentHistory, documentUpdateDocumentHistory, content },
      { bucket }
    ) => {
      bucket.forEach((update) => {
        Y.applyUpdate(ydoc, db.toBuffer(update.update));
      });

      const newContent = ydoc.getText("codemirror").toJSON();
      const diff = gitDiff(content, newContent);

      if (!diff)
        return {
          documentHistory,
          documentUpdateDocumentHistory,
          content: newContent,
        };

      const sequence = documentHistory.length + 1;
      bucket.forEach((update) => {
        documentUpdateDocumentHistory.push({
          document_update_id: update.id,
          document_id,
          sequence,
        });
      });

      documentHistory.push({
        document_id,
        sequence,
        diff,
      });

      return {
        documentHistory,
        documentUpdateDocumentHistory,
        content: newContent,
      };
    },
    { documentHistory: [], documentUpdateDocumentHistory: [], content: "" }
  );

  return bucket_history;
}

export async function getDocumentHistoryFromTable(document_id: string) {
  return db
    .select("app.document_history", {
      document_id: document_id,
    })
    .run(pool);
}

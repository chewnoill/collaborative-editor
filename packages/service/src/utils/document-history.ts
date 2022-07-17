import * as Y from "yjs";
import { pool, db } from "../db";
import gitDiff from "git-diff";

//select changes in document_updates_queue
export async function fetchDocumentHistoryBuckets(document_id: string) {
  const buckets = await db.sql`
  SELECT
        to_timestamp (extract ('epoch' from created_at)::int/60*60) as timeslice,
        user_id, document_id, array_agg(document_update)

        from document_updates_queue
        left join users on document_updates_queue.user_id = users.id
        Where document_id = ${db.param(document_id)}
        group by document_id, timeslice, user_id, users.name
        order by timeslice ASC`.run(pool);

  return buckets;
}
export async function replaceDocumentHistory(document) {
  const documentHistory = await buildDocumentHistoryBuckets(document);
  await db.serializable(pool, async (txnClient) => {
    await db
      .deletes("document_history", {
        document_id: document.id,
      })
      .run(txnClient);

    return db.insert("document_history", documentHistory).run(txnClient);
  });
}

export async function buildDocumentHistoryBuckets({
  id: document_id,
}: {
  id: string;
}) {
  const bucket_history = await fetchDocumentHistoryBuckets(document_id);
  const ydoc = new Y.Doc();
  return bucket_history
    .reduce((acc, { array_agg, ...update }) => {
      array_agg.forEach((element) => {
        Y.applyUpdate(ydoc, element);
      });

      const content = ydoc.getText("codemirror").toJSON();
      const prevContent = acc.length ? acc[acc.length - 1].content : "";
      const diff = gitDiff(prevContent, content);

      if (!diff) return acc;

      acc.push({
        ...update,
        sequence: acc.length + 1,
        content,
        diff,
      });

      return acc;
    }, [])
    .map(({ content: _content, ...history }) => history);
}

export async function getDocumentHistoryFromTable(document_id: string) {
  return db
    .select("document_history", {
      document_id: document_id,
    })
    .run(pool);
}

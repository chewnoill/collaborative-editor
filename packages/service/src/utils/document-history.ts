import * as Y from "yjs";
import { pool, db } from "../db";
import gitDiff from "git-diff";

//select changes in document_updates_queue
export async function fetchDocumentHistoryBuckets(document_id: string) {
  const buckets = await db.sql`
  SELECT 
        to_timestamp (extract ('epoch' from created_at)::int/60*60) as timeslice, 
        user_id, document_id, users.name as username, array_agg(document_update)
       
        from document_updates_queue 
        left join users on document_updates_queue.user_id = users.id
        Where document_id = ${db.param(document_id)}
        group by document_id, timeslice, user_id, users.name
        order by timeslice ASC`.run(pool);

  return buckets;
}

//drop histories with document id
export async function removeFromDocumentHistory(document) {
  await db.sql`
    DELETE FROM document_history
    where document_history.document_id = ${db.param(document.document_id)}
  `.run(pool);
}

const dropAndAdd = (document, arr) =>
  db.serializable(pool, (txnClient) =>
    Promise.all([
      db
        .deletes("document_history", {
          document_id: document.id,
        })
        .run(txnClient),
      db.insert("document_history", arr).run(txnClient),
    ])
  );

export async function replaceDocumentHistory(document) {
  let arr = await buildDocumentHistoryBuckets(document);
  let insertArr = arr.map(({ document_id, user_id, diff }) => ({
    document_id,
    user_id,
    diff,
  }));
  await dropAndAdd(document, insertArr);
}

export async function buildDocumentHistoryBuckets({
  id: document_id,
}: {
  id: string;
}) {
  const bucket_history = await fetchDocumentHistoryBuckets(document_id);
  const ydoc = new Y.Doc();
  return bucket_history.reduce((acc, update) => {
    update.array_agg.forEach((element) => {
      Y.applyUpdate(ydoc, element);
    });

    const content = ydoc.getText("codemirror").toJSON();

    acc.push({
      document_id: document_id,
      user_id: update.user_id,
      content: content,
      diff: gitDiff(acc.length ? acc[acc.length - 1].content : "", content),
    });

    return acc;
  }, []);

  return;
}

export async function getDocumentHistoryFromTable(document_id: string) {
  return db
    .select("document_history", {
      document_id: document_id,
    })
    .run(pool);
}

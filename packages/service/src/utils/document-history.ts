import * as Y from "yjs";
import { pool, db } from "../db";
import gitDiff from "git-diff";

function fetchDocumentHistory(document_id: string) {
  return db
    .select(
      "document_updates_queue",
      { document_id },
      {
        order: { by: "created_at", direction: "ASC" },
        lateral: {
          user: db.selectExactlyOne(
            "users",
            { id: db.parent("user_id") },
            { columns: ["id", "name"] }
          ),
        },
      }
    )
    .run(pool);
}

export async function buildDocumentHistory(document_id: string) {
  const history = await fetchDocumentHistory(document_id);
  const ydoc = new Y.Doc();
  return history.reduce((acc, update) => {
    Y.applyUpdate(ydoc, db.toBuffer(update.document_update));

    const content = ydoc.getText("codemirror").toJSON();
    acc.push({
      user: "user" in update && (update as any).user,
      content: content,
      diff: gitDiff(acc.length ? acc[acc.length - 1].content : "", content),
    });
    return acc;
  }, []);
}

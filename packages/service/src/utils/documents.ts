import * as Y from "yjs";
import { db, pool, schema } from "../db";

const TEXT_NAME = "codemirror";

export function insertUpdate(document_id: string, document_update: Uint8Array) {
  return db
    .insert("document_updates_queue", {
      document_id,
      document_update: Buffer.from(document_update),
    })
    .run(pool);
}

export const createDocument = (doc: Y.Doc) =>
  db
    .insert("document", {
      value: doc.getText(TEXT_NAME).toJSON(),
      origin: Buffer.from(Y.encodeStateAsUpdate(doc)),
      web_rtc_key: "",
      latest_update_time: new Date(),
    })
    .run(pool);

type DocumentWithUpdates = schema.document.Selectable & {
  document_updates?: schema.document_updates_queue.Selectable[];
};

export function fetchDocument(id: string): Promise<DocumentWithUpdates> {
  return db
    .selectExactlyOne(
      "document",
      { id },
      {
        lateral: {
          document_updates: db.select("document_updates_queue", {
            document_id: db.parent("id"),
            created_at: db.conditions.gt(db.parent("latest_update_time")),
          }),
        },
      }
    )
    .run(pool)
    .then((doc: any) => ({
      ...doc,
      latest_update_time: db.toDate(doc.latest_update_time),
      origin: db.toBuffer(doc.origin),
      document_updates: doc.document_updates.map((update) => ({
        ...update,
        created_at: db.toDate(update.created_at),
        document_update: db.toBuffer(update.document_update),
      })),
    }));
}

export const selectUserDocuments = (user: { id: string }) =>
  db.sql`
SELECT ${"document"}.* FROM document 
INNER JOIN ${"user_document"} ON ${"user_document"}.${"document_id"} = ${"document"}.${"id"}
WHERE ${{ user_id: user.id }}`.run(pool);
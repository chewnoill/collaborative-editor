import { Pool } from "pg";
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

export function updateDocumentMeta(
  document_id: string,
  meta: {
    is_public?: boolean;
    name?: string;
  }
) {
  // remove undefined keys from metadata object
  Object.keys(meta).forEach(
    (key) => meta[key] === undefined && delete meta[key]
  );
  return db.update("document", meta, {
    id: document_id,
  });
}

export function updateDocumentContent(
  document_id: string,
  value: string,
  origin: Buffer,
  latest_update_time: Date | db.SQLFragment
) {
  return db
    .update(
      "document",
      {
        value,
        origin,
        latest_update_time,
      },
      {
        id: document_id,
      }
    )
    .run(pool);
}

export const createDocument = (
  pool: Pool,
  {
    creator_id = db.sql`current_user_id()`,
    doc = new Y.Doc(),
    name,
  }: {
    creator_id?: any;
    doc?: Y.Doc;
    name: string;
  }
) =>
  db
    .insert("document", {
      name,
      value: doc.getText(TEXT_NAME).toJSON(),
      origin: Buffer.from(Y.encodeStateAsUpdate(doc)),
      web_rtc_key: "web_rtc_key",
      creator_id,
      latest_update_time: db.sql`now()`,
    })
    .run(pool);

export const inviteUser = (
  {
    doc,
    user: current_user,
  }: {
    doc: { id: string };
    user: { id: string };
  },
  user_to_invite: string
) =>
  db
    .insert("user_document", {
      document_id: db.sql`SELECT document.id FROM document WHERE document.creator_id = ${db.param(
        current_user.id
      )} and document.id = ${db.param(doc.id)}`,
      user_id: db.sql`SELECT users.id FROM users WHERE users.name = ${db.param(
        user_to_invite
      )}`,
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
          document_updates: db.select(
            "document_updates_queue",
            {
              document_id: db.parent("id"),
              created_at: db.conditions.gt(db.parent("latest_update_time")),
            },
            { order: { by: "created_at", direction: "ASC" } }
          ),
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
  LEFT JOIN ${"user_document"}
  ON ${"user_document"}.${"document_id"} = ${"document"}.${"id"}
  WHERE ${{ user_id: user.id }}
  OR ${{ creator_id: user.id }}`.run(pool);

export const selectAllUpdatedDocuments = () =>
  db.sql`
SELECT DISTINCT ${"document"}.${"id"}, ${"document"}.${"latest_update_time"} FROM ${"document_updates_queue"}
  JOIN ${"document"} ON ${"document"}.${"id"} = ${"document_updates_queue"}.${"document_id"}
  WHERE ${"document_updates_queue"}.${"created_at"} > ${"document"}.${"latest_update_time"}
  ORDER BY ${"document"}.${"latest_update_time"} ASC
`.run(pool);

import { Pool } from "pg";
import * as Y from "yjs";
import { toBuffer } from "zapatos/db";
import { db, pool, schema } from "../db";

const TEXT_NAME = "codemirror";

export function insertUpdate(
  document_id: string,
  document_update: Buffer,
  {
    user_id = db.sql`current_user_id()`,
  }: { user_id?: db.SQLFragment | string } = {}
) {
  return db.insert("app.document_updates_queue", {
    user_id,
    document_id,
    document_update,
  });
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
  return db.update("app.document", meta, {
    id: document_id,
  });
}

export function updateDocumentTags(document_id, tags: string[]) {
  if(tags.length === 0){
    return db.deletes("app.document_tags",{document_id}).run(pool)
  }
  return db.sql`
WITH
  inputs(value) as (values ${tags.map(
    (tag, i) =>
      db.sql`(${db.param(tag)})${db.raw(i < tags.length - 1 ? "," : "")}`
  )}),
  deletions AS (
    DELETE FROM ${"app.document_tags"}
    WHERE
      ${"document_id"} = ${db.param(document_id)}
      AND ${"tag"} not in (select value from inputs)
  )
INSERT INTO ${"app.document_tags"} (${"tag"},${"document_id"})
SELECT value, ${db.param(document_id)}
FROM inputs
ON CONFLICT DO NOTHING
  `.run(pool);
}

export function updateDocumentContent(
  document_id: string,
  value: string,
  origin: Buffer,
  latest_update_time: Date | db.SQLFragment
) {
  return db
    .update(
      "app.document",
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

function CreateEmptyDoc() {
  const ydoc = new Y.Doc();
  return ydoc;
}

export const createDocument = (
  pool: Pool,
  {
    creator_id = db.sql`current_user_id()`,
    doc = CreateEmptyDoc(),
    is_public,
    name,
    latest_update_time = db.sql`now()`,
  }: {
    creator_id?: any;
    doc?: Y.Doc;
    is_public?: boolean;
    name: string;
    latest_update_time?: Date | db.SQLFragment;
  }
) =>
  db
    .insert("app.document", {
      name,
      value: doc.getText(TEXT_NAME).toJSON(),
      origin: Buffer.from(Y.encodeStateAsUpdate(doc)),
      web_rtc_key: "web_rtc_key",
      creator_id,
      latest_update_time,
      is_public,
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
    .insert("app.user_document", {
      document_id: db.sql`SELECT document.id FROM document WHERE document.creator_id = ${db.param(
        current_user.id
      )} and document.id = ${db.param(doc.id)}`,
      user_id: db.sql`SELECT users.id FROM users WHERE users.name = ${db.param(
        user_to_invite
      )}`,
    })
    .run(pool);

export type DocumentWithUpdates = schema.app.document.Selectable & {
  document_updates?: schema.app.document_updates_queue.Selectable[];
};

export function fetchDocument(id: string): Promise<DocumentWithUpdates> {
  return db
    .selectExactlyOne(
      "app.document",
      { id },
      {
        lateral: {
          document_updates: db.select(
            "app.document_updates_queue",
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

export function buildYDoc(dbDoc: DocumentWithUpdates) {
  const yDoc = new Y.Doc();

  Y.applyUpdate(
    yDoc,
    Y.mergeUpdates([
      dbDoc.origin,
      ...dbDoc.document_updates.map((update) => update.document_update),
    ])
  );

  return yDoc;
}

export const selectUserDocuments = (user: { id: string }) =>
  db.sql`
  SELECT ${"app.document"}.* FROM ${"app.document"}
  LEFT JOIN ${"app.user_document"}
  ON ${"app.user_document"}.${"document_id"} = ${"app.document"}.${"id"}
  WHERE ${{ user_id: user.id }}
  OR ${{ creator_id: user.id }}`.run(pool);

export const selectAllUpdatedDocuments = () =>
  db.sql`
SELECT DISTINCT ${"app.document"}.${"id"}, ${"app.document"}.${"latest_update_time"} FROM ${"app.document_updates_queue"}
  JOIN ${"app.document"} ON ${"app.document"}.${"id"} = ${"app.document_updates_queue"}.${"document_id"}
  WHERE ${"app.document_updates_queue"}.${"created_at"} > ${"app.document"}.${"latest_update_time"}
  ORDER BY ${"app.document"}.${"latest_update_time"} ASC
`.run(pool);

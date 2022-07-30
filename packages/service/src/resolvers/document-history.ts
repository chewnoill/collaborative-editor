import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import DataLoader from "dataloader";
import { db, pool } from "../db";

type HistoryKey = [string, number];

export function fetchDocumentHistoryBatch(keys: HistoryKey[]) {
  return db.sql`
SELECT
  history.document_id, sequence, max(created_at) as timeslice,
  array_agg(
    distinct jsonb_build_object(
      'id', users.id,
      'name', users.name
    )
  ) as users
from document_update_document_history as history
join document_updates_queue
  on document_updates_queue.id = history.document_update_id
left join users
  on document_updates_queue.user_id = users.id
where (history.document_id, sequence) in (
  ${keys
    .map(([id, seq]) => db.sql`(${db.param(id)}, ${db.param(seq)})`)
    .reduce((acc, frag) => {
      if (acc === null) {
        return frag;
      }
      return db.sql`${acc},${frag}`;
    }, null)}
)
group by history.document_id, sequence
`
    .run(pool)
    .then((vals) => {
      return keys.map((key) =>
        vals.find(
          (val) => val.document_id === key[0] && val.sequence === key[1]
        )
      );
    });
}

const historyLoader = new DataLoader<
  HistoryKey,
  { timeslice: Date; users: { id: string; name: string }[] }
>(fetchDocumentHistoryBatch);

const DocumentHistory = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type DocumentHistory {
        timeslice: Datetime @requires(columns: ["document_id", "sequence"])
        users: [HistoryUser]! @requires(columns: ["document_id", "sequence"])
      }
      type HistoryUser {
        id: ID
        name: String
      }
    `,
    resolvers: {
      DocumentHistory: {
        timeslice({ documentId, sequence }) {
          return historyLoader
            .load([documentId, sequence])
            .then((history) => history?.timeslice);
        },
        users({ documentId, sequence }) {
          return historyLoader
            .load([documentId, sequence])
            .then((history) => history?.users);
        },
      },
    },
  };
});

export default DocumentHistory;

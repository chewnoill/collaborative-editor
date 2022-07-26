import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { toBuffer } from "zapatos/db";
import { db } from "../db";
import { queue } from "../mq";
import {
  createDocument,
  insertUpdate,
  updateDocumentMeta,
} from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Mutation {
        # Individual record
        createDoc(name: String!): Document
        updateDocument(id: UUID!, update: DocumentUpdateInput!): Document
        editDocument(id: UUID!, update: String!): Boolean
      }
      input DocumentUpdateInput {
        isPublic: Boolean
        name: String
      }
    `,
    resolvers: {
      Mutation: {
        createDoc(_, { name }, { pgClient }) {
          return createDocument(pgClient, { name });
        },
        async editDocument(_, { id, update }, { pgClient }) {
          await insertUpdate(id, toBuffer(update), {
            user_id: db.sql`current_user_id()`,
          }).run(pgClient);
          await queue.add("update-document", { document_id: id, update });
          return true;
        },
        async updateDocument(_, { id, update }, { pgClient }) {
          const meta = await updateDocumentMeta(id, {
            name: update.name,
            is_public: update.isPublic,
          }).run(pgClient);
          if (meta.length === 0) return null;
          return {
            ...meta[0],
            isPublic: meta[0].is_public,
            latestUpdateTime: meta[0].latest_update_time,
            creatorId: meta[0].creator_id,
          };
        },
      },
    },
  };
});

export default DocumentMutations;

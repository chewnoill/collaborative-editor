import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { decodeUpdate } from "yjs";
import { toBuffer } from "zapatos/db";
import { db } from "../db";
import logger from "../logger";
import { queue } from "../mq";
import {
  createDocument,
  insertUpdate,
  updateDocumentMeta,
} from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  const updatedDocument = async (id, resolveInfo) => {

    const [row] = await resolveInfo.graphile.selectGraphQLResultFromTable(
      sql.fragment`(
        select * from app.document
        where id = ${sql.value(id)}
      )`,
      () => {} // no-op
    );

    return row;
  };
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
      }
    `,
    resolvers: {
      Mutation: {
        createDoc(_, { name }, { pgClient }) {
          return createDocument(pgClient, { name });
        },
        async editDocument(_, { id, update }, { pgClient }) {
          const decodedUpdate = decodeUpdate(toBuffer(update));
          logger({
            level: "info",
            service: "edit-document",
            message: "update received",
            body: {
              decodedUpdate,
            },
          });
          await insertUpdate(id, toBuffer(update), {
            user_id: db.sql`current_user_id()`,
          }).run(pgClient);
          await queue.add("update-document", { document_id: id, update });
          return true;
        },
        async updateDocument(_, { id, update }, { pgClient }, resolveInfo) {
          await updateDocumentMeta(id, pgClient, {
            is_public: update.isPublic,
          });
          return updatedDocument(id, resolveInfo);
        },
      },
    },
  };
});

export default DocumentMutations;

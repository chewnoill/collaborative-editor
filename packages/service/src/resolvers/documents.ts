import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { createDocument, updateDocumentMeta } from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Mutation {
        # Individual record
        createDoc(name: String!): Document
        updateDocument(id: UUID!, update: DocumentUpdateInput!): Document
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

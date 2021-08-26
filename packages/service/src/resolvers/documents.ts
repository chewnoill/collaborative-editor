import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { createDocument } from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Mutation {
        # Individual record
        createDocument: Document
      }
    `,
    resolvers: {
      Mutation: {
        createDocument(_, __, { pgClient }) {
          return createDocument(pgClient);
        },
      },
    },
  };
});

export default DocumentMutations;

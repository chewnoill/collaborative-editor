import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { createDocument } from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend type Mutation {
        # Individual record
        createDoc: Document
      }
    `,
    resolvers: {
      Mutation: {
        createDoc(_, __, { pgClient }) {
          return createDocument(pgClient);
        },
      },
    },
  };
});

export default DocumentMutations;

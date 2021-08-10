import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { createDocument } from "../utils/documents";

const DocumentMutations = makeExtendSchemaPlugin((build) => {
  // Get any helpers we need from `build`
  const { pgSql: sql, inflection } = build;

  return {
    typeDefs: gql`
      extend type Mutation {
        # Individual record
        createDocument: Document
      }
    `,
    resolvers: {
      Mutation: {
        createDocument(a, b, { pgClient }, d) {
          return createDocument(pgClient);
        },
      },
    },
  };
});

export default DocumentMutations;

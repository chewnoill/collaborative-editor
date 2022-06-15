import { GraphQLJSONObject } from "graphql-type-json";
import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { buildDocumentHistory } from "../utils/document-history";

const DocumentHistoryQuery = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Document {
        history: DocumentHistoryQuery @requires(columns: ["id"])
      }
      type DocumentHistoryQuery {
        events: [DocumentEvent!]!
      }
      type DocumentEvent {
        user: DocumentEventUser
        diff: String
      }
      type DocumentEventUser {
        id: ID!
        name: String!
      }
    `,
    resolvers: {
      Document: {
        history: ({ id }) => ({ events: buildDocumentHistory(id) }),
      },
      JSONObject: GraphQLJSONObject as any,
    },
  };
});

export default DocumentHistoryQuery;

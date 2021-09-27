import { GraphQLJSONObject } from "graphql-type-json";
import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import { safeRenderString } from "../utils/mdx";

const RenderQueries = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      extend type Query {
        render: RenderQuery
      }

      type RenderQuery {
        preview(id: ID!, value: String!): MdxResult
      }

      type MdxResult {
        id: ID!
        value: String!
        mdx: Mdx!
      }

      type Mdx {
        code: String!
        staticMDX: String!
        scope: JSONObject!
      }

      scalar JSONObject

      extend type Document {
        mdx: Mdx @requires(columns: ["value"])
      }
    `,
    resolvers: {
      Query: {
        render: () => ({}),
      },

      RenderQuery: {
        preview: (_, { id, value }) => ({
          id,
          value,
          mdx: safeRenderString(value, {}),
        }),
      },
      Document: {
        mdx: ({ value }) => safeRenderString(value, {}),
      },
      JSONObject: GraphQLJSONObject as any,
    },
  };
});

export default RenderQueries;

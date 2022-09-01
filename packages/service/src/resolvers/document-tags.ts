import { makeExtendSchemaPlugin, gql } from "graphile-utils";

const DocumentTags = makeExtendSchemaPlugin((build) => {
  const { pgSql: sql } = build;
  const popularDocumentTags = async (parent, args, context, resolveInfo) => {
    const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
      sql.fragment`(
  select app.document_tags.* from (
    select
      id,
      rank() over (partition by tag order by id) as rank
    from app.document_tags
  ) ranked
  join app.document_tags using(id)
  where rank = 1
)`,
      () => {} // no-op
    );

    return rows;
  };

  return {
    typeDefs: gql`
      extend type Query {
        tags: TagsQuery!
      }

      type TagsQuery {
        popular: [DocumentTag!]!
      }
    `,
    resolvers: {
      Query: {
        tags: () => ({}),
      },
      TagsQuery: {
        popular: popularDocumentTags,
      },
    },
  };
});

export default DocumentTags;

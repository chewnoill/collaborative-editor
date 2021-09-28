import { gql, useQuery } from "@apollo/client";

const USER_FRAGMENT = gql`
  fragment base_user on User {
    id
    name
  }
`;

const DOCUMENT_FRAGMENT = gql`
  fragment base_document on Document {
    id
    origin
    value
    latestUpdateTime
    mdx {
      staticMDX
      code
      scope
    }
  }
`;

export function useCurrentUserQuery() {
  return useQuery(
    gql`
      query getCurrentUser {
        me {
          ...base_user
        }
        random {
          name
        }
      }
      ${USER_FRAGMENT}
    `,
    { fetchPolicy: "cache-first" }
  );
}
export function useCurrentUser() {
  return useCurrentUserQuery().data?.me;
}

export function useAllDocumentsQuery() {
  return useQuery(
    gql`
      query AllDocuments {
        allDocuments {
          edges {
            node {
              ...base_document
            }
          }
        }
      }
      ${DOCUMENT_FRAGMENT}
    `,
    { fetchPolicy: "cache-first" }
  );
}

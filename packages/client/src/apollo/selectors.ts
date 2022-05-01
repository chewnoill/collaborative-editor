import { gql, useQuery } from "@apollo/client";

const USER_FRAGMENT = gql`
  fragment base_user on User {
    id
    name
  }
`;

export const DOCUMENT_FRAGMENT = gql`
  fragment base_document on Document {
    id
    name
    origin
    value
    latestUpdateTime
    isPublic
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

export function useDocument(id: string) {
  return useQuery(
    gql`
      query Document($id: UUID!) {
        documentById(id: $id) {
          ...base_document
        }
      }
      ${DOCUMENT_FRAGMENT}
    `,
    { fetchPolicy: "cache-first", variables: { id } }
  );
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
export function useMyDocumentsQuery() {
  return useQuery(
    gql`
      query MyDocuments {
        me {
          documentsByCreatorId{
            edges {
              node {
                ...base_document
              }
            }
          }
        }
      }
      ${DOCUMENT_FRAGMENT}
    `,
    { fetchPolicy: "cache-first" }
  );
}
export function usePreviewMdx(id, value) {
  return useQuery(
    gql`
      query previewMdx($id: ID!, $value: String!) {
        render {
          preview(id: $id, value: $value) {
            id
            mdx {
              staticMDX
              scope
              code
            }
          }
        }
      }
    `,
    { fetchPolicy: "cache-first", variables: { id, value } }
  );
}

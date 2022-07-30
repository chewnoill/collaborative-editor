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
    creatorId
    userByCreatorId {
      id
      name
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

export function useDocumentQuery(id: string) {
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

export function useDocumentHistory(id: string) {
  return useQuery(
    gql`
      query DocumentHistory($id: UUID!) {
        documentById(id: $id) {
          documentHistoriesByDocumentId {
            edges {
              node {
                diff
                timeslice
                users {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `,
    { variables: { id } }
  );
}

export const useDocument = (id: string) =>
  useDocumentQuery(id).data?.documentById;

export function useAllDocumentsQuery() {
  return useQuery(
    gql`
      query AllDocuments {
        allDocuments(orderBy: LATEST_UPDATE_TIME_DESC, first: 10) {
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
          documentsByCreatorId(orderBy: LATEST_UPDATE_TIME_DESC) {
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
export const useMyDocuments = () => {
  const { data, ...rest } = useMyDocumentsQuery();
  return { documents: data?.me.documentsByCreatorId.edges, ...rest };
};

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

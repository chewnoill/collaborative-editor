import { gql, useQuery } from "@apollo/client";

const USER_FRAGMENT = gql`
  fragment base_user on User {
    id
    name
  }
`;

export function useCurrentUserQuery() {
  return useQuery(
    gql`
      query getCurrentUser {
        me {
          ...base_user
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

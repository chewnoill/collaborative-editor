import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchDocuments: relayStylePagination(["search"]),
        },
      },
      User: {
        fields: {
          documentsByCreatorId: relayStylePagination(["id"]),
        },
      },
    },
  }),
});

export default client;

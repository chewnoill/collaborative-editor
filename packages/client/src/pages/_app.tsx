import styled from "@emotion/styled";
import { ReduxProvider } from "ducks/store";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import client from "utils/apollo";

const AppLayout = styled.div`
  max-width: 100%;
  display: flex;
  justify-content: center;
`;
const Page = styled.div`
  width: 100%;
`;

export default function MyApp({ Component, pageProps }) {
  return (
    <AppLayout>
      <Page>
        <ApolloProvider client={client}>
          <ErrorBoundary
            fallbackRender={({ error }) => <div>{error.message}</div>}
          >
            <ReduxProvider>
              <Component {...pageProps} />
            </ReduxProvider>
          </ErrorBoundary>
        </ApolloProvider>
      </Page>
    </AppLayout>
  );
}

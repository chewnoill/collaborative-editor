import styled from "@emotion/styled";
import { ReduxProvider } from "ducks/store";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import client from "utils/apollo";
import { Global } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const AppLayout = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Page = styled.div`
  width: 100%;
  height: 100%;
`;

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={createTheme({})}>
      <AppLayout>
        <Global styles={{ body: { margin: 0 } }} />
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
    </ThemeProvider>
  );
}

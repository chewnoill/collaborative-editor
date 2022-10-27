import styled from "@emotion/styled";
import { ReduxProvider } from "ducks/store";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ApolloProvider } from "@apollo/client";
import client from "utils/apollo";
import { Global } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import { useMediaQuery } from "@mui/material";

const AppLayout = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;

  & {
    background: white;
    color: rgba(0, 0, 0, 0.87);
  }
  @media (prefers-color-scheme: light) {
    & {
      background: white;
      color: rgba(0, 0, 0, 0.87);
    }
  }
  @media (prefers-color-scheme: dark) {
    & {
      background: black;
      color: white;
    }
  }
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

export default function MyApp({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <script src="/newrelic.js" />
        <title>Will Docs</title>
      </Head>
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

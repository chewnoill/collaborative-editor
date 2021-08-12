import styled from "@emotion/styled";
import { ReduxProvider } from "ducks/store";

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
        <ReduxProvider>
          <Component {...pageProps} />
        </ReduxProvider>
      </Page>
    </AppLayout>
  );
}

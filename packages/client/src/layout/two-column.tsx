import React from "react";
import styled from "@emotion/styled";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";

const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 64px);
  padding-top: 64px;
  & > * {
    width: 50%;
    overflow: scroll;
  }
`;
const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: none;
`;
export function TwoColumnLayout({
  children,
}: {
  children: [React.ReactChild, React.ReactChild];
}) {
  return (
    <Container maxWidth="lg">
      <PageLayout>
        <AppBar>
          <Toolbar>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CreateDocumentButton />
              <Account />
            </div>
          </Toolbar>
        </AppBar>
        <Content>{children}</Content>
      </PageLayout>
    </Container>
  );
}

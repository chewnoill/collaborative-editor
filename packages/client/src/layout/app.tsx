import styled from "@emotion/styled";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
export function SimpleLayout({ children }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 300,
          height: 300,
          padding: "10px",
          marginTop: "20px",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default function AppLayout({
  children,
  fab,
}: {
  children: any;
  fab?: any;
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
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
        <Box sx={{ height: "calc(100% - 64px)", marginTop: "64px" }}>
          {children}
        </Box>
      </PageLayout>
      {fab}
    </Container>
  );
}

import styled from "@emotion/styled";
import React from "react";
import AppBar from "@mui/material/AppBar";
import AppToolBar from "components/tool-bar";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export default function FullWidth({ children }: { children: any; fab?: any }) {
  return (
    <PageLayout>
      <AppBar>
        <AppToolBar />
      </AppBar>
      {children}
    </PageLayout>
  );
}

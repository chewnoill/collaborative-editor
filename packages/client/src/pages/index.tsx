import styled from "@emotion/styled";
import { useCurrentUserQuery } from "apollo/selectors";
import DocumentList from "components/document-list";
import React from "react";
import AppLayout from "layout/app";

const Link = styled.a`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

export default function Index() {
  const me = useCurrentUserQuery();
  return (
    <AppLayout>
      <DocumentList />
    </AppLayout>
  );
}

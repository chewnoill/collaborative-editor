import styled from "@emotion/styled";
import { useCurrentUserQuery, useMyDocumentsQuery } from "apollo/selectors";
import { DocumentView } from "components/document-list";
import React from "react";
import AppLayout from "layout/app";
import { List } from "@mui/material";

export default function Index() {
  const me = useCurrentUserQuery();
  const { data, error, loading } = useMyDocumentsQuery();
  if (error) {
    return null;
  }
  if (loading) return <div>loading...</div>;

  const list = (data?.me?.documentsByCreatorId?.edges || []).map(
    ({ node }) => node
  );

  return (
    <AppLayout>
      <List>
        {list.map((doc) => (
          <DocumentView key={doc.id} id={doc.id} mdx={doc.mdx} />
        ))}
      </List>
    </AppLayout>
  );
}

import React from "react";
import styled from "@emotion/styled";
import {
  useMyDocuments,
} from "apollo/selectors";
import { DocumentView } from "./document-list";

const List = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function MyDocuments() {
  const { documents, error, loading } = useMyDocuments();
  if (error) {
    return null;
  }
  console.log({documents, loading})
  if (loading) return <div>loading...</div>;

  const list = (documents || []).map(({ node }) => node);

  return (
    <List>
      {list.map((doc) => (
        <DocumentView key={doc.id} id={doc.id} mdx={doc.mdx} />
      ))}
    </List>
  );
}

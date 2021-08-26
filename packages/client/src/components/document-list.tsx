import React from "react";
import styled from "@emotion/styled";
import { useAllDocumentsQuery } from "apollo/selectors";

const List = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function DocumentList() {
  const { data, error, loading } = useAllDocumentsQuery();
  if (error) {
    return null;
  }
  if (loading) return <div>loading...</div>;

  const list = (data?.allDocuments?.edges || []).map(({ node }) => node);

  return (
    <List>
      {list.length} documents have been found
      {list.map((doc) => (
        <li key={doc.id}>
          <p>{"DOC ID: " + doc.id}</p>
          <p>{"DOC OWNER " + doc.creator_id}</p>
          <a href={`/document/${doc.id}`}>document</a>
        </li>
      ))}
    </List>
  );
}

import React from "react";
import styled from "@emotion/styled";
import { useGetDocumentsQuery } from "../ducks/api";

const List = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function DocumentList() {
  const { data, error, isLoading } = useGetDocumentsQuery();
  if (error) {
    console.log(error);
    return null;
  }
  if (isLoading) return <div>loading...</div>;

  return (
    <List>
      {data.length} documents have been found
      {data.map((doc) => (
        <li key={doc.id}>
          <p>{"DOC ID: " + doc.id}</p>
          <p>{"DOC OWNER " + doc.creator_id}</p>
        </li>
      ))}
    </List>
  );
}

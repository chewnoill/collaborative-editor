import React from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { setDocuments, selectUserDocuments } from "./redux/appState/document";

const List = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function DocumentList() {
  const userDocs = useSelector(selectUserDocuments);
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetch("/api/documents")
      .then((data) => data.json())
      .then((data) => dispatch(setDocuments(data.documents)));
  }, []);
  if (!userDocs) return <div>loading...</div>;

  return (
    <List>
      {Object.keys(userDocs).length} documents have been found
      {Object.values(userDocs).map((doc) => (
        <li key={doc.id}>
          <p>{"DOC ID: " + doc.id}</p>
          <p>{"DOC OWNER " + doc.creator_id}</p>
        </li>
      ))}
    </List>
  );
}

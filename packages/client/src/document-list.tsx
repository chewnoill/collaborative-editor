import React from "react";
import styled from "@emotion/styled";

const List = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function DocumentList() {
  const [documents, setDocuments] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/documents")
      .then((data) => {
        setDocuments(data.json());
      });
  }, []);
  if(!documents) return <div>loading...</div>

  return <List>{documents.length} documents have been found</List>;
}

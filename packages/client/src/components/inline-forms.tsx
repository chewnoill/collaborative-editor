import styled from "@emotion/styled";
import React from "react";
import { DocumentName } from "./document-name";
import SelectTags from "./select-tags";

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function InlineForm({ document_id }) {
  return (
    <List>
      <DocumentName document_id={document_id} />
      <SelectTags document_id={document_id} />
    </List>
  );
}

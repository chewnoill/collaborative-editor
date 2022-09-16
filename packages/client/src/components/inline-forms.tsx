import styled from "@emotion/styled";
import { Box } from "@mui/system";
import React from "react";
import DocumentMetaData from "./document-meta-data";
import { DocumentName } from "./document-name";
import SelectTags from "./select-tags";

const List = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 10px;
  }
`;

export default function InlineForm({ document_id }) {
  return (
    <List>
      <DocumentMetaData document_id={document_id}/>
      <SelectTags document_id={document_id} />
    </List>
  );
}

import React from "react";
import styled from "@emotion/styled";
import { useAllDocumentsQuery } from "apollo/selectors";
import { DocumentView } from "./document-list";
import Creatable from "react-select/creatable";
import date from "date-and-time";
import CodeBlock from "./code-block";
import { Box } from "@mui/system";
import { Chip } from "@mui/material";

function Tags({ tags }) {
  const options = tags.map(({ tag }) => ({ value: tag, label: tag }));
  return (
    <Box>
      {tags.map(({ tag }) => (
        <Chip label={tag} />
      ))}
    </Box>
  );
  return <Creatable isDisabled isMulti value={options} options={options} />;
}

export function DocGridRow({ doc }: any) {
  return (
    <>
      <div className="name">{doc.name}</div>
      <div className="">
        {date.format(new Date(doc.latestUpdateTime), "YYYY/MM/DD HH:mm:ss")}
      </div>
      <Tags tags={doc.documentTagsByDocumentId.nodes} />
      <CodeBlock className="language-md">{doc.value}</CodeBlock>
      <DocumentView {...doc} />
    </>
  );
}

const Grid = styled.div`
  padding: 24px;
  padding-top: 64px;
  width: 100vw;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 60px 150px 200px 500px auto;
  & > * {
    max-height: 200px;
  }
`;

const Label = styled.h3``;

export default function DocumentGrid() {
  const { data, error, loading } = useAllDocumentsQuery();
  if (error) {
    return null;
  }
  if (loading) return <div>loading...</div>;

  const list = (data?.allDocuments?.edges || []).map(({ node }) => node);

  return (
    <Grid>
      <Label>Name</Label>
      <Label>Last update time</Label>
      <Label>Tags</Label>
      <Label>Value</Label>
      <Label style={{ textAlign: "center" }}>view</Label>
      {list.map((doc) => (
        <DocGridRow key={doc.id} doc={doc} />
      ))}
    </Grid>
  );
}

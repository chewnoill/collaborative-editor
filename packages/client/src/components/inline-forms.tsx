import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import DocumentMetaData from "./document-meta-data";
import SelectTags from "./select-tags";
import MenuIcon from "@mui/icons-material/Menu";

const List = styled.div(
  ({ open }: { open }) => `
  transition: height 0.1s;
  height: ${open ? 166 : 0}px;
  width: 100%;

  display: flex;
  overflow: hidden;
  flex-direction: column;
  & > * {
    margin-bottom: 10px;
  }
`);

export default function InlineForm({ document_id }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{display: "flex",flexDirection:"row", alignItems: "start"}}>
      <IconButton onClick={() => setOpen(!open)}>
        <MenuIcon />
      </IconButton>
      <List open={open}>
        <DocumentMetaData document_id={document_id} />
        <SelectTags document_id={document_id} />
      </List>
    </Box>
  );
}

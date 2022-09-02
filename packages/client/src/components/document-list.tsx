import React, { useRef } from "react";
import styled from "@emotion/styled";
import { useAllDocumentsQuery } from "apollo/selectors";
import { hydrate } from "mdx-hydra/build/hydrate";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import DocumentMenu from "./document-menu";
import PreviewWrapper from "./preview-wrapper";
import { MdxComponents } from "./document-render-mdx";

export function DocumentView({ id, mdx }: any) {
  const ref = useRef();
  const router = useRouter();
  return (
    <PreviewWrapper
      ref={ref}
      sx={{ position: "relative", minHeight: "60px", width: "100%" }}
    >
      <Button
        onClick={() => router.push(`/document/${id}`)}
        sx={{
          width: "100%",
          color: "text.primary",
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: "5px",
          marginY: "10px",
          padding: "5px",
          backgroundColor: "white",
          cursor: "pointer",
          textAlign: "inherit",
          textTransform: "none",
          minHeight: "60px",
          maxHeight: "800px",
          overflow: "hidden",
          alignItems: "normal",
          justifyContent: "left",
        }}
      >
        {hydrate({
          ...mdx,
          components: MdxComponents,
          Wrapper: ({ children }) => children,
        })}
      </Button>
      <DocumentMenu document_id={id} />
    </PreviewWrapper>
  );
}

const List = styled.div`
  max-width: 500px;
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
      {list.map((doc) => (
        <DocumentView key={doc.id} id={doc.id} mdx={doc.mdx} />
      ))}
    </List>
  );
}

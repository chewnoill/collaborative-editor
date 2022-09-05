import styled from "@emotion/styled";
import { Box } from "@mui/material";
import DocumentMenu from "components/document-menu";
import InlineForm from "components/inline-forms";
import { BreakPoints } from "layout/break-points";
import FullWidth from "layout/full-width";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useRef } from "react";

const EditorComponent = dynamic(() => import("components/editor"), {
  ssr: false,
});

const PreviewDoc = dynamic<any>(
  () => import("components/document-render-mdx"),
  {
    ssr: false,
  }
);

const DynamicLayout = styled(Box)`
  margin-top: 80px;
  display: grid;
  height: calc(100% - 64px);
  grid-template-areas:
    "edit edit edit";
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;

  .preview {
    display: none;
    grid-area: prev;
  }

  @media only screen and (${BreakPoints[1]}) {
    grid-template-areas:
      "padl edit edit edit edit prev prev prev padr"
      "padl edit edit edit edit prev prev prev padr"
      "padl edit edit edit edit prev prev prev padr";
    grid-template-rows: 64px 1fr 1fr 1fr;
    grid-template-columns: 10px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 10px;
    .preview {
      display: block;
      height: 100%;
      overflow: scroll;
    }
  }
`;

const GridWrapper = styled(Box)``;

export default function Document() {
  const router = useRouter();
  const { id } = router.query;
  const ref = useRef();

  if (!id || typeof id !== "string") return null;
  return (
    <FullWidth>
      <DynamicLayout>
        <GridWrapper gridArea="edit">
          <InlineForm document_id={id} />
          <EditorComponent document_id={id} />
          <DocumentMenu document_id={id} position="fixed" />
        </GridWrapper>
        <GridWrapper className="preview">
          <PreviewDoc id={id} />
        </GridWrapper>
      </DynamicLayout>
    </FullWidth>
  );
}

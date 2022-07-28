import styled from "@emotion/styled";
import { Box } from "@mui/material";
import DocumentMenu from "components/document-menu";
import { DocumentName } from "components/document-name";
import WhosHere from "components/whos-here";
import AppLayout from "layout/app";
import EditorLayout from "layout/editor-layout";
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
margin-top: 64px;
display: grid;
height: calc(100% - 64px);
grid-template-areas:
  'name name name'
  'edit edit edit'
  'edit edit edit'
  'edit edit edit'
  'whos whos whos';
grid-template-rows: 64px 1fr 1fr 1fr 1fr;
grid-template-columns: 1fr 1fr 1fr;

.preview {
  display: none;
  grid-area: prev
}
@media only screen and (min-width: 600px) {
  grid-template-areas:
    'padl name name name name padr'
    'padl edit edit edit whos padr'
    'padl edit edit edit whos padr'
    'padl edit edit edit whos padr';
  grid-template-rows: 64px 1fr 1fr 1fr;
  grid-template-columns: 10px 1fr 1fr 1fr 1fr 10px;
}
@media only screen and (min-width: 1200px) {
  grid-template-areas:
    'padl name name name name prev prev prev padr'
    'padl edit edit edit whos prev prev prev padr'
    'padl edit edit edit whos prev prev prev padr'
    'padl edit edit edit whos prev prev prev padr';
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

  if (!id) return null;
  return (
    <EditorLayout
      fab={<DocumentMenu document_id={id.toString()} position="fixed" />}
    >
      <DynamicLayout>
        <GridWrapper gridArea="name">
          <DocumentName document_id={id.toString()} />
        </GridWrapper>
        <GridWrapper gridArea="edit">
          <EditorComponent document_id={id.toString()} />
        </GridWrapper>
        <GridWrapper gridArea="whos">
          <WhosHere document_id={id.toString()} />
        </GridWrapper>
        <GridWrapper className="preview">
          <PreviewDoc id={id} />
        </GridWrapper>
      </DynamicLayout>
    </EditorLayout>
  );
}

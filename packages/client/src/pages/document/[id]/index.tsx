import styled from "@emotion/styled";
import { Box } from "@mui/material";
import DocumentMenu from "components/document-menu";
import InlineForm from "components/inline-forms";
import { selectYDocument } from "ducks/appState/y-doc";
import { BreakPoints } from "layout/break-points";
import FullWidth from "layout/full-width";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useSelector } from "react-redux";

const EditorComponent = dynamic(() => import("components/editor"), {
  ssr: false,
});

const PreviewDoc = dynamic<any>(
  () => import("components/document-render-mdx"),
  {
    ssr: false,
  }
);

const Layout = styled(Box)`
  margin-top: 80px;
  height: calc(100% - 80px);
  align-self: center;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  @media screen and (${BreakPoints[1]}) {
    max-width: 1200px;
  }
`;

export default function Document() {
  const router = useRouter();
  const { id } = router.query;
  const ydoc = useSelector((store) =>
    selectYDocument(store, { id: id as string })
  );

  if (!id || typeof id !== "string") return null;
  return (
    <FullWidth>
      <Head>
        <title>Will Docs: {ydoc && ydoc.getMap('meta').get('name')}</title>
      </Head>
      <Layout>
        <InlineForm document_id={id} />
        <EditorComponent document_id={id} />
        <DocumentMenu document_id={id} position="fixed" />
      </Layout>
    </FullWidth>
  );
}

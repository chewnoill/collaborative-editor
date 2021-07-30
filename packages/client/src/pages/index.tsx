import styled from "@emotion/styled";
import Me from "components/me";
import DocumentSelect from "components/select-document";
import React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/editor"), { ssr: false });

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Index() {
  return (
    <PageLayout>
      <Me />
      <a href="/login">Login</a>
      <DocumentSelect />
      <Editor />
    </PageLayout>
  );
}
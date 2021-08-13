import styled from "@emotion/styled";
import React from "react";
import dynamic from "next/dynamic";
import Me from "components/me";
import DocumentSelect from "components/select-document";
import DocumentCreate from "components/create-document";

const Link = styled.a`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const EditorComponent = dynamic(() => import("../components/editor"), {
  ssr: false,
});

const Page = styled.div`
  display: flex;
  flex-direction: column;
`;

const EditingSpace = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f7f4d4;
`;

export default function Editor() {
  return (
    <Page>
      <Header>
        <Me />
        <Link href="/">Back to Account</Link>
        <DocumentCreate />
        <DocumentSelect />
      </Header>
      <EditingSpace>
        <EditorComponent />
      </EditingSpace>
    </Page>
  );
}

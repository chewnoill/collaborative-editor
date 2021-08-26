import styled from "@emotion/styled";
import { useCurrentUserQuery } from "apollo/selectors";
import CreateDocument from "components/create-document";
import DocumentList from "components/document-list";
import Me from "components/me";
import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../ducks/appState/user";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f7f4d4;
`;

const Link = styled.a`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

export default function Index() {
  const me = useCurrentUserQuery();
  return (
    <div>
      <PageLayout>
        <Me />
        <Link href="/login">Login</Link>
        <Link href="/create-user">Create Account</Link>
        <Link href="/update-password">Update Password</Link>
        {me ? <Link href="/editor">Documents</Link> : null}
        <CreateDocument />
        <DocumentList />
      </PageLayout>
    </div>
  );
}

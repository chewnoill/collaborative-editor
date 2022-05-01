import { useCurrentUser } from "apollo/selectors";
import DocumentList from "components/document-list";
import MyDocuments from "components/my-documents";
import React from "react";
import AppLayout from "layout/app";

export default function Index() {
  const me = useCurrentUser();
  return <AppLayout>{me ? <MyDocuments /> : <DocumentList />}</AppLayout>;
}

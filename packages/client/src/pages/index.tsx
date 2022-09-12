import { useCurrentUser } from "apollo/selectors";
import DocumentList from "components/document-list";
import MyDocuments from "components/my-documents";
import React from "react";
import AppLayout from "layout/app";
import { useSelector } from "react-redux";
import { selectSearch } from "ducks/appState/search";
import SearchResults from "components/search-results";

export default function Index() {
  const me = useCurrentUser();
  const query = useSelector(selectSearch);
  return (
    <AppLayout>
      {me ? query ? <SearchResults /> : <MyDocuments /> : <DocumentList />}
    </AppLayout>
  );
}

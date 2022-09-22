import React from "react";
import AppLayout from "layout/app";
import DocumentGrid from "components/document-grid";
import FullWidth from "layout/full-width";

export default function Index() {
  return (
    <FullWidth>
      {" "}
      <DocumentGrid />
    </FullWidth>
  );
}

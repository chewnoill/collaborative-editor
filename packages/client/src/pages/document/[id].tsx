import DocumentMenu from "components/document-menu";
import { DocumentName } from "components/document-name";
import AppLayout from "layout/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useRef } from "react";

const EditorComponent = dynamic(() => import("components/editor"), {
  ssr: false,
});

export default function Document() {
  const router = useRouter();
  const { id } = router.query;
  const ref = useRef();

  if (!id) return null;
  return (
    <AppLayout
      fab={<DocumentMenu document_id={id.toString()} position="fixed" />}
    >
      <DocumentName document_id={id.toString()} />
      <div style={{ display: "flex", height: "100%" }}>
        <EditorComponent document_id={id.toString()} />
      </div>
    </AppLayout>
  );
}

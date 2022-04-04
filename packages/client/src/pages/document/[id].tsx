import DocumentMenu from "components/document-menu";
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
    <AppLayout>
      <EditorComponent document_id={id.toString()} />
      <DocumentMenu parent={ref} document_id={id.toString()} />
    </AppLayout>
  );
}

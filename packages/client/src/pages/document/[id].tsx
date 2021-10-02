import PreviewMdx from "components/document-render-mdx";
import { DocumentSettings } from "components/document-settings";
import AppLayout from "layout/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const EditorComponent = dynamic(() => import("components/editor"), {
  ssr: false,
});

export default function Document() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;
  return (
    <AppLayout>
      <EditorComponent document_id={id.toString()} />
      <PreviewMdx id={id.toString()} />
      <DocumentSettings document_id={id.toString()} />
    </AppLayout>
  );
}

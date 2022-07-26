import DocumentMenu from "components/document-menu";
import useYDoc from "hooks/use-y-doc";
import AppLayout from "layout/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const PreviewDoc = dynamic<any>(
  () => import("components/document-render-mdx"),
  {
    ssr: false,
  }
);

export default function Document() {
  const router = useRouter();
  const { id } = router.query;
  useYDoc(id, "viewer");

  if (!id) return null;
  return (
    <AppLayout>
      <PreviewDoc id={id} />
    </AppLayout>
  );
}

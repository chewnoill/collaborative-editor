import AppLayout from "layout/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

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
    </AppLayout>
  );
}

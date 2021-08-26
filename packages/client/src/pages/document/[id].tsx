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
    <div>
      <EditorComponent document_id={id.toString()} />
    </div>
  );
}

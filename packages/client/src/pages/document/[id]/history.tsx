import { useDocumentHistory } from "apollo/selectors";
import AppLayout from "layout/app";
import { useRouter } from "next/router";
import React from "react";

export default function Document() {
  const router = useRouter();
  const { id } = router.query;
  const { error, loading, data } = useDocumentHistory(id as string);

  if (!id) return null;
  return (
    <AppLayout>
      <pre>{JSON.stringify({ id, error, loading, data }, null, 2)}</pre>
    </AppLayout>
  );
}

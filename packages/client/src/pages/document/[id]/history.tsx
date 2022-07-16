import { useDocumentHistory } from "apollo/selectors";
import HighlightHistory from "components/highlight-history";
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
      {data?.documentById.documentHistoriesByDocumentId.edges.map(
        ({ node }) => (
          <HighlightHistory
            code={node.diff}
            username={node.userByUserId?.name}
            timeslice={node.timeslice}
          />
        )
      )}
    </AppLayout>
  );
}

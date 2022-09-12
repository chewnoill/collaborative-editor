import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { useMyDocuments } from "apollo/selectors";
import { DocumentView } from "./document-list";
import useInfiniteScroll from "react-infinite-scroll-hook";

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
export default function MyDocuments() {
  const {
    documents,
    hasNextPage,
    endCursor,
    fetchMore,
    loading,
    error,
  } = useMyDocuments();

  const loadFunc = React.useCallback(() => {
    hasNextPage && fetchMore({ variables: { after: endCursor } });
  }, [hasNextPage, endCursor]);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadFunc,
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <List>
      {documents &&
        documents.map(({ node: doc }) => (
          <DocumentView key={doc.id} {...doc} />
        ))
      }
      {(loading || hasNextPage) && (
        <div ref={sentryRef}>
          <span>loading...</span>
        </div>
      )}
    </List>
  );
}

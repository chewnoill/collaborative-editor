import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { DOCUMENT_FRAGMENT, useMyDocuments } from "apollo/selectors";
import { DocumentView } from "./document-list";
import { Input } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import useInfiniteScroll from "react-infinite-scroll-hook";

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

function useDocumentSearch() {
  return useLazyQuery(gql`
    query SearchForDocument($query: String!) {
      searchDocuments(search: $query, first: 10) {
        totalCount
        nodes {
          ...base_document
        }
      }
    }

    ${DOCUMENT_FRAGMENT}
  `);
}

function SearchResults({ query }) {
  const [run, { data, error, loading }] = useDocumentSearch();
  useEffect(() => {
    const timer = setTimeout(() => {
      run({ variables: { query } });
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  if (error) {
    return null;
  }
  const list = data?.searchDocuments.nodes || [];
  if (loading && !data) return <div>loading...</div>;
  return (
    <>
      {list.map((doc) => (
        <DocumentView key={doc.id} id={doc.id} mdx={doc.mdx} />
      ))}
    </>
  );
}

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

  const [query, setQuery] = React.useState("");


  return (
    <List>
      <Input
        className="search"
        name="search"
        placeholder="Search..."
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
      />
      {query ? (
        <SearchResults query={query} />
      ) : (
        documents &&
        documents.map(({ node: doc }) => (
          <DocumentView key={doc.id} {...doc} />
        ))
      )}
      {(loading || hasNextPage) && (
        <div ref={sentryRef}>
          <span>loading...</span>
        </div>
      )}
    </List>
  );
}

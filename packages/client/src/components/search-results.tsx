import { gql, useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { DOCUMENT_FRAGMENT } from "apollo/selectors";
import { selectSearch } from "ducks/appState/search";
import React, { useEffect } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { DocumentView } from "./document-list";

function useDocumentSearch() {
  return useLazyQuery(gql`
    query SearchForDocument($query: String!, $after: Cursor) {
      searchDocuments(search: $query, first: 1, after: $after) {
        totalCount
        edges {
          node {
            ...base_document
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }

    ${DOCUMENT_FRAGMENT}
  `);
}

const List = styled.div`
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

export default function SearchResults() {
    const query = useSelector(selectSearch);
    const [run, { data, error, loading, fetchMore }] = useDocumentSearch();

    const {hasNextPage,endCursor} = data?.searchDocuments.pageInfo || {}

  const loadFunc = React.useCallback(() => {
    hasNextPage && fetchMore({ variables: { after: endCursor } });
  }, [hasNextPage, endCursor]);

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage: data?.searchDocuments?.pageInfo.hasNextPage,
        onLoadMore: loadFunc,
        disabled: !!error,
        rootMargin: "0px 0px 400px 0px",
      });
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
    const list = data?.searchDocuments.edges || [];
    if (loading && !data) return <div>loading...</div>;
    return (
      <List>
        {list.map(({node}) => (
          <DocumentView key={node.id} {...node} />
        ))}
      {(loading || hasNextPage) && (
        <div ref={sentryRef}>
          <span>loading...</span>
        </div>
      )}
      </List>
    );
  }


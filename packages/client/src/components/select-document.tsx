import React from "react";
import { useDispatch } from "react-redux";
import { setDocument } from "ducks/appState/document";
import { gql, useQuery } from "@apollo/client";

export default function DocumentSelect() {
  const dispatch = useDispatch();

  const { data, loading } = useQuery(gql`
    query getDocumentList {
      allDocuments {
        edges {
          node {
            id
            value
          }
        }
      }
    }
  `);

  if (loading) return <div>loading...</div>;
  if (!data?.allDocuments?.edges) {
    return null;
  }

  return (
    <select
      onChange={({ target: { value } }) => {
        dispatch(setDocument({ id: value }));
      }}
    >
      <option id="" value="">
        select a document
      </option>
      {data.allDocuments.edges.map(({ node: doc }) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </select>
  );
}

import React from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { setDocument } from "ducks/appState/document";
import { gql, useQuery } from "@apollo/client";

const Select = styled.select`
  text-align-last: center;
  padding-left: 15px;
`;

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
    <Select
      onChange={({ target: { value } }) => {
        dispatch(setDocument({ id: value }));
      }}
    >
      <option id="" value="">
        Select Document
      </option>
      {data.allDocuments.edges.map(({ node: doc }) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </Select>
  );
}

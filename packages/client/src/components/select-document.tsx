import React from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { setDocument } from "../ducks/appState/document";
import { useGetDocumentsQuery } from "../ducks/api";

const Select = styled.select`
  text-align-last: center;
  padding-left: 15px;
`;

export default function DocumentSelect() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetDocumentsQuery();
  if (error) {
    console.log(error);
    return null;
  }
  if (isLoading) return <div>loading...</div>;

  return (
    <Select
      onChange={({ target: { value } }) => {
        dispatch(setDocument({ id: value }));
      }}
    >
      <option id="" value="">
        Select Document
      </option>
      {data.map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </Select>
  );
}

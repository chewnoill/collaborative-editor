import React from "react";
import { useDispatch } from "react-redux";
import { setDocument } from "../ducks/appState/document";
import { useGetDocumentsQuery } from "../ducks/api";

export default function DocumentSelect() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetDocumentsQuery();
  if (error) {
    console.log(error);
    return null;
  }
  if (isLoading) return <div>loading...</div>;

  return (
    <select
      onChange={({ target: { value } }) => {
        dispatch(setDocument({ id: value }));
      }}
    >
      <option id="" value="">
        select a document
      </option>
      {data.map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </select>
  );
}

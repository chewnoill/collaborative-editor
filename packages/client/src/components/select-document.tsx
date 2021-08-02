import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDocuments,
  setDocument,
  selectUserDocuments,
} from "ducks/appState/document";

export default function DocumentSelect() {
  const userDocs = useSelector(selectUserDocuments);
  const dispatch = useDispatch();

  React.useEffect(() => {
    fetch("/api/documents")
      .then((data) => data.json())
      .then((data) => dispatch(setDocuments(data.documents)));
  }, []);

  if (!userDocs) {
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
      {userDocs.map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </select>
  );
}

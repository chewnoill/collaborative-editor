import React from "react";
import fetch from "node-fetch";
import { useDispatch } from "react-redux";
import { setDocument } from "./redux/appState/document";

export default function DocumentSelect() {
  const dispatch = useDispatch();

  const [documents, setDocuments] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/documents")
      .then((data) => data.json())
      .then((data) => {
        setDocuments(data.documents);
      });
  }, []);

  if (!documents) {
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
      {documents.map((doc) => (
        <option key={doc.id} value={doc.id}>
          {doc.id.slice(0, 5)}
        </option>
      ))}
    </select>
  );
}

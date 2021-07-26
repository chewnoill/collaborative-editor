import React from "react";
import fetch from "node-fetch";

export default function DocumentSelect() {
  const [documents, setDocuments] = React.useState(null);
  React.useEffect(() => {
    fetch("/api/documents")
      .then((data) => data.json())
      .then((data) => {
        setDocuments(data);
      });
  }, []);

  console.log({ documents });
  return <label>{documents?.username || "not logged in"}</label>;
}

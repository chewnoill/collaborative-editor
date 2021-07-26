import React from "react";
import styled from "@emotion/styled";

const Form = styled.form`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function CreateDocument() {
  const [posting, setPosting] = React.useState(null);

  return (
    <Form
      onSubmit={() => {
        setPosting(true);
        fetch("/api/document", {
          method: "POST",
        }).then(() => setPosting(false));
      }}
    >
      <h2>create a new document</h2>
      <button type="submit" disabled={posting}>
        submit
      </button>
    </Form>
  );
}

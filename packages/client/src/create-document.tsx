import React from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "./redux/appState/user";
import { addDocument } from "./redux/appState/document";

const Form = styled.form`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function CreateDocument() {
  const me = useSelector(selectUser);
  const [posting, setPosting] = React.useState(null);
  const dispatch = useDispatch();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        setPosting(true);
        fetch("/api/document", {
          method: "POST",
        })
          .then((data) => data.json())
          .then(({ document }) => {
            if (!document.id || !document.creator_id) return;
            dispatch(addDocument(document));
            setPosting(false);
          });
      }}
    >
      <h2>
        {me ? "create a new document" : "log in to create a new document"}
      </h2>
      <button type="submit" disabled={posting || !me}>
        submit
      </button>
    </Form>
  );
}

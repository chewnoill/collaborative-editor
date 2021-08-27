import React from "react";
import styled from "@emotion/styled";
import { useCurrentUserQuery } from "apollo/selectors";
import { gql, useMutation } from "@apollo/client";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function CreateDocument() {
  const me = useCurrentUserQuery();
  const [mutation] = useMutation(gql`
    mutation createDocument {
      createDoc {
        id
      }
    }
  `);
  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await mutation();
    window.location.href = `/document/${data?.createDoc?.id}`;
  };

  return (
    <Form onSubmit={(e) => handleCreate(e)}>
      <h2 style={{ textAlign: "center" }}>
        {me ? "create a new document" : "log in to create a new document"}
      </h2>
      <button type={"submit"} disabled={!me}>
        New Document
      </button>
    </Form>
  );
}

import React from "react";
import styled from "@emotion/styled";
import { usePostDocumentMutation } from "../ducks/api";
import { useGetDocumentsQuery } from "../ducks/api";
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
      createDocument {
        id
      }
    }
  `);
  const [postDocument, { isLoading: postLoading }] = usePostDocumentMutation();
  const { refetch } = useGetDocumentsQuery();

  const handleCreate = async (e) => {
    e.preventDefault();
    await mutation();
    await refetch();
  };

  return (
    <Form onSubmit={(e) => handleCreate(e)}>
      <h2 style={{ textAlign: "center" }}>
        {me ? "create a new document" : "log in to create a new document"}
      </h2>
      <button type={"submit"} disabled={postLoading || !me}>
        New Document
      </button>
    </Form>
  );
}

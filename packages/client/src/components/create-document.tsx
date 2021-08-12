import React from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { selectUser } from "../ducks/appState/user";
import { usePostDocumentMutation } from "../ducks/api";
import { useGetDocumentsQuery } from "../ducks/api";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function CreateDocument() {
  const me = useSelector(selectUser);
  const [postDocument, { isLoading: postLoading }] = usePostDocumentMutation();
  const { refetch } = useGetDocumentsQuery();

  const handleCreate = async (e) => {
    e.preventDefault();
    await postDocument();
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

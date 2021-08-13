import React from "react";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { selectUser } from "../ducks/appState/user";
import { usePostDocumentMutation } from "../ducks/api";
import { useGetDocumentsQuery } from "../ducks/api";

const Form = styled.form`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export default function CreateDocument() {
  const me = useSelector(selectUser);
  const [postDocument, { isLoading: postLoading }] = usePostDocumentMutation();
  const { refetch } = useGetDocumentsQuery();
  const name = "whatever";
  // const updateName = (event) => {
  //   setName(event.target.value)
  // }

  const handleCreate = async (e) => {
    e.preventDefault();
    await postDocument({name});
    await refetch();
  };

  return (
    <Form onSubmit={handleCreate}>
      <h2>
        {me ? "Create a new document" : "Log in to create a new document"}
      </h2>
      <label>Document Name</label> <input name="name" type="text" value="whatever"/>
      <button type={"submit"} disabled={postLoading || !me}>
        submit
      </button>
    </Form>
  );
}
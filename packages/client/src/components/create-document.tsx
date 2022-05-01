import React from "react";
import styled from "@emotion/styled";
import { useCurrentUser, useCurrentUserQuery } from "apollo/selectors";
import { gql, useMutation } from "@apollo/client";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import AddIcon from "@mui/icons-material/Add";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function CreateDocumentButton() {
  const me = useCurrentUser();
  const [mutation] = useMutation(gql`
    mutation createDocument($name: String!) {
      createDoc(name: $name) {
        id
      }
    }
  `);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await mutation({ variables: { name: "" } });
    window.location.href = `/document/${data?.createDoc?.id}`;
  };

  // only logged in users can create documents.
  if (!me) {
    return <div />;
  }

  return (
    <IconButton onClick={handleCreate}>
      <AddIcon htmlColor="white" />
    </IconButton>
  );
}

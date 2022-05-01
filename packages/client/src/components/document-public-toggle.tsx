import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Switch from "@mui/material/Switch";
import Box from "@mui/system/Box";
import { DOCUMENT_FRAGMENT, useDocument } from "apollo/selectors";
import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export function DocumentPublicToggle({ document_id }) {
  const document = useDocument(document_id);
  const [mutation] = useMutation(gql`
    mutation updateDocument($id: UUID!, $isPublic: Boolean!) {
      updateDocument(id: $id, update: { isPublic: $isPublic }) {
        ...base_document
      }
    }
    ${DOCUMENT_FRAGMENT}
  `);

  console.log({ data, document_id });
  if (!document) return null;

  return (
    <FormControlLabel
      control={
        <Switch
          onChange={({ target: { checked } }) =>
            mutation({ variables: { id: document_id, isPublic: checked } })
          }
        />
      }
      label="Public"
      checked={document.isPublic}
    />
  );
}

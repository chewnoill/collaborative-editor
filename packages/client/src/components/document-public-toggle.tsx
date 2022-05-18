import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Switch from "@mui/material/Switch";
import {
  DOCUMENT_FRAGMENT,
  useCurrentUser,
  useDocument,
} from "apollo/selectors";
import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export function DocumentPublicToggle({ document_id }) {
  const document = useDocument(document_id);
  const me = useCurrentUser();
  const [mutation] = useMutation(gql`
    mutation updateDocument($id: UUID!, $isPublic: Boolean!) {
      updateDocument(id: $id, update: { isPublic: $isPublic }) {
        ...base_document
      }
    }
    ${DOCUMENT_FRAGMENT}
  `);

  if (!document) return null;
  const disabled = me?.id !== document.creatorId;

  return (
    <FormControlLabel
      control={
        <Switch
          onChange={({ target: { checked } }) =>
            !disabled &&
            mutation({ variables: { id: document_id, isPublic: checked } })
          }
        />
      }
      disabled={disabled}
      label="Public"
      checked={document.isPublic}
    />
  );
}

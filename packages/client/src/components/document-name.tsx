import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import {
  DOCUMENT_FRAGMENT,
  useCurrentUser,
  useDocument,
} from "apollo/selectors";
import React from "react";
import TextField from "@mui/material/TextField";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

function DocumentNameEditor({ document_id, name: defaultName, disabled }) {
  const [name, setName] = React.useState(defaultName);

  React.useEffect(() => {
    mutation({ variables: { id: document_id, name } });
  }, [name]);

  const [mutation] = useMutation(gql`
    mutation updateDocumentName($id: UUID!, $name: String!) {
      updateDocument(id: $id, update: { name: $name }) {
        ...base_document
      }
    }
    ${DOCUMENT_FRAGMENT}
  `);
  if (!document) return null;

  return (
    <TextField
      sx={{ width: "100%" }}
      label="Name"
      variant="outlined"
      name="name"
      onChange={(evt) => {
        setName(evt.target.value);
      }}
      value={name}
      disabled={disabled}
    />
  );
}

export function DocumentName({ document_id }) {
  const document = useDocument(document_id);
  const user = useCurrentUser();

  if (!document) return null;
  return (
    <DocumentNameEditor
      name={document.name}
      document_id={document_id}
      disabled={user?.id !== document?.creatorId}
    />
  );
}

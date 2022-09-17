import React from "react";
import styled from "@emotion/styled";
import { gql, useMutation } from "@apollo/client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

function UserForm({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <Form {...props}>
      <TextField
        sx={{ marginY: "15px" }}
        label="username"
        variant="outlined"
        name="username"
      />
      <TextField
        sx={{ marginBottom: "15px" }}
        label="password"
        variant="outlined"
        name="password"
        type="password"
      />
      {children}
    </Form>
  );
}
export function LoginForm() {
  return (
    <UserForm action="/api/login" method="post">
      <Button variant="outlined" type="submit">
        Login
      </Button>
    </UserForm>
  );
}
export function CreateUserForm() {
  const [mutate] = useMutation(gql`
    mutation CreateUser($username: String!, $password: String!) {
      createUser(input: { name: $username, password: $password }) {
        user {
          id
          name
        }
      }
    }
  `);
  return (
    <UserForm
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.target as any);
        mutate({ variables: Object.fromEntries(data) }).then(
          () => (window.location.href = "/")
        );
      }}
      method="post"
    >
      <Button variant="outlined" type="submit">
        Create Account
      </Button>
    </UserForm>
  );
}
export function UpdatePasswordForm() {
  return (
    <UserForm action="/api/users/update-password" method="post">
      <TextField
        sx={{ marginBottom: "15px" }}
        label="New Password"
        variant="outlined"
        name="new-password"
        type="password"
      />
      <label>new password</label> <input name="new-password" type="password" />
      <Button variant="outlined" type="submit">
        Update Password
      </Button>
    </UserForm>
  );
}

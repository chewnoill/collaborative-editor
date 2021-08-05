import React from "react";
import styled from "@emotion/styled";

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
      <label>username</label> <input name="username" type="text" />
      <label>password</label> <input name="password" type="password" />
      {children}
      <button type="submit">submit</button>
    </Form>
  );
}
export function LoginForm() {
  return <UserForm action="/api/login" method="post" />;
}
export function CreateUserForm() {
  return <UserForm action="/api/users/create" method="post" />;
}
export function UpdatePasswordForm() {
  return (
    <UserForm action="/api/users/update-password" method="post">
      <label>new password</label> <input name="new-password" type="password" />
    </UserForm>
  );
}

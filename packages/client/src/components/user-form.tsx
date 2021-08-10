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
      <label>Username</label> <input name="username" type="text" />
      <label>Password</label> <input name="password" type="password" />
      {children}
    </Form>
  );
}
export function LoginForm() {
  return (
    <UserForm action="/api/login" method="post">
      <button type="submit">Log in</button>
    </UserForm>
  );
}
export function CreateUserForm() {
  return (
    <UserForm action="/api/user/create-user" method="post">
      <button type="submit">Create Account</button>
    </UserForm>
  );
}
export function UpdatePasswordForm() {
  return (
    <UserForm action="/api/users/update-password" method="post">
      <label>New Password</label> <input name="new-password" type="password" />
      <button type="submit">Update Password</button>
    </UserForm>
  );
}

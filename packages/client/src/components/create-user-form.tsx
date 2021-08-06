import React from "react";
import styled from "@emotion/styled";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function CreateUserForm() {
  return (
    <Form action="/api/user/create_user" method="post">
      <label>Username</label> <input name="username" type="text" />
      <label>Password</label> <input name="password" type="password" />
      <button type="submit">Create Account</button>
    </Form>
  );
}

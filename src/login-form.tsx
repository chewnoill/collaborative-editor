import React from "react";
import styled from "@emotion/styled";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function LoginForm() {
  return (
    <Form action="/api/login" method="post">
      <label>username</label> <input name="username" type="text" />
      <label>password</label> <input name="password" type="password" />
      <button type="submit">submit</button>
    </Form>
  );
}

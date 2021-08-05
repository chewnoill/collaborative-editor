import React from "react";
import styled from "@emotion/styled";
import { selectUser } from "ducks/appState/user";
import { useSelector } from "react-redux";
import Me from "./me";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export function LoginForm() {
  return (
    <Form action="/api/login" method="post">
      <label>username</label> <input name="username" type="text" />
      <label>password</label> <input name="password" type="password" />
      <button type="submit">submit</button>
    </Form>
  );
}

export function GuardedLoginForm() {
  const me = useSelector(selectUser);

  return (
    <>
      <Me />
    </>
  );
}

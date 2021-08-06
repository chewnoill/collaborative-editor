import React from "react";
import styled from "@emotion/styled";
import { selectUser } from "ducks/appState/user";
import { useSelector } from "react-redux";
import Me from "./me";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function LoginForm() {
  return (
    <Form>
      <label>Username</label> <input name="username" type="text" />
      <label>Password</label> <input name="password" type="password" />
      <button type="submit" formAction="/api/login" formMethod="post">
        Login
      </button>
      <p>--- Update your password ---</p>
      <button type="submit" formAction="/update_password">
        Update Password
      </button>
    </Form>
  );
}

export function GuardedLoginForm() {
  const me = useSelector(selectUser);
  console.log(me);

  return (
    <>
      <Me />
    </>
  );
}

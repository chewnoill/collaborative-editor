import React from "react";
import styled from "@emotion/styled";

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default function UpdatePasswordForm() {
  return (
    <Form action="/api/user/update_password" method="post">
      <label>Username</label> <input name="username" type="text" />
      <label>Current Password</label> <input name="password" type="password" />
      <label>New Password</label> <input name="new_password" type="password" />
      <button type="submit">Update Password</button>
    </Form>
  );
}

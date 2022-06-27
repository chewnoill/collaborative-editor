import React from "react";
import { LoginForm } from "components/user-form";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { SimpleLayout } from "layout/app";

export default function FailedLoginPage() {
  return (
    <SimpleLayout>
      <Alert severity="error">Incorrect username and/or password</Alert>
      <LoginForm />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Button href="/create-user">Create Account</Button>
        <Button href="/update-password">Update Password</Button>
      </Box>
    </SimpleLayout>
  );
}

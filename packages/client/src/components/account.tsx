import { Button, Typography, IconButton, Box } from "@mui/material";
import { useCurrentUser } from "apollo/selectors";
import React from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";

function AccountProfile({ user }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography>{user.name}</Typography>
      <IconButton
        size="large"
        aria-label="account of current user"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
    </Box>
  );
}

export default function Account() {
  const user = useCurrentUser();
  if (user) {
    return <AccountProfile user={user} />;
  }
  return (
    <Button variant="contained" href="/login">
      Login
    </Button>
  );
}

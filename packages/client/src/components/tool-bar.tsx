import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";
import { useRouter } from "next/router";
import { ArrowLeft } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function AppToolbar() {
  const { pathname } = useRouter();

  return (
    <Toolbar>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
          }}
        >
          {pathname === "/document/[id]" && (
            <IconButton href="/">
              <ArrowLeft htmlColor="white" />
            </IconButton>
          )}
          <CreateDocumentButton />
        </div>
        <Account />
      </div>
    </Toolbar>
  );
}

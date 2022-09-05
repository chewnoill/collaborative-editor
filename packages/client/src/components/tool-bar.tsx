import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";
import { useRouter } from "next/router";
import { ArrowLeft } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import WhosHere from "./whos-here";

export default function AppToolbar() {
  const router = useRouter();
  const { id: document_id } = router.query;

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
          {document_id && (
            <IconButton href="/">
              <ArrowLeft htmlColor="white" />
            </IconButton>
          )}
          <CreateDocumentButton />
          {document_id && <WhosHere document_id={document_id} />}
        </div>
        <Account />
      </div>
    </Toolbar>
  );
}

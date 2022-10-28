import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";
import { useRouter } from "next/router";
import { ArrowLeft } from "@mui/icons-material";
import {
  ThemeProvider,
  createTheme,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import WhosHere from "./whos-here";
import { Input } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectSearch, setSearchString } from "ducks/appState/search";
import Logo from "./logo";
import styled from "@emotion/styled";
import { BreakPoints } from "layout/break-points";

const SearchInput = styled(Input)`
  width: 100%;

  max-width: 800px;
  margin: 0px 8px;
  @media screen and (${BreakPoints[1]}) {
    max-width: 1200px;
  }
  @media screen and (min-width: 800px) {
    margin: auto;
  }
`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AppToolbar() {
  const router = useRouter();
  const { id: document_id, q } = router.query;
  const dispatch = useDispatch();
  const searchString = useSelector(selectSearch);

  React.useEffect(() => {
    if (searchString === undefined && q) {
      dispatch(setSearchString(q));
    }
  }, [searchString, q]);
  React.useEffect(() => {
    if (searchString) {
      router.replace({
        query: { q: searchString },
      });
    }
  }, [searchString]);

  return (
    <ThemeProvider theme={darkTheme}>
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
            <Logo />
            {document_id && (
              <IconButton
                href={
                  router.route === "/document/[id]/view"
                    ? `/document/${document_id}`
                    : "/"
                }
              >
                <ArrowLeft htmlColor="white" />
              </IconButton>
            )}
            <CreateDocumentButton />
            {document_id && <WhosHere document_id={document_id} />}
            {!document_id && (
              <SearchInput
                className="search"
                name="search"
                placeholder="Search..."
                value={searchString || ""}
                onChange={(evt) => {
                  dispatch(setSearchString(evt.target.value));
                }}
              />
            )}
          </div>
          <Box sx={{ display: "flex" }}>
            {document_id && (
              <Button
                sx={{ marginRight: "10px" }}
                href={
                  router.route === "/document/[id]/view"
                    ? `/document/${document_id}`
                    : `/document/${document_id}/view`
                }
              >
                {router.route === "/document/[id]/view" ? "Edit" : "Preview"}
              </Button>
            )}
            <Account />
          </Box>
        </div>
      </Toolbar>
    </ThemeProvider>
  );
}

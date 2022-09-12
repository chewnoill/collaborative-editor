import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Account from "components/account";
import CreateDocumentButton from "components/create-document";
import { useRouter } from "next/router";
import { ArrowLeft } from "@mui/icons-material";
import { ThemeProvider, createTheme, IconButton } from "@mui/material";
import WhosHere from "./whos-here";
import { Input } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectSearch, setSearchString } from "ducks/appState/search";

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
            {document_id && (
              <IconButton href="/">
                <ArrowLeft htmlColor="white" />
              </IconButton>
            )}
            <CreateDocumentButton />
            {document_id && <WhosHere document_id={document_id} />}
            {!document_id && (
              <Input
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
          <Account />
        </div>
      </Toolbar>
    </ThemeProvider>
  );
}

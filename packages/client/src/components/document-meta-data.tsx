import { selectYDocument } from "ducks/appState/y-doc";
import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Select,
  TextField,
} from "@mui/material";
import Selectable from "react-select";

const wrap_options = [
  {
    label: "No Wrap",
    value: "no-wrap",
  },
  {
    label: "Soft Wrap",
    value: "soft-wrap",
  },
];

function DocumentMetaData({ document_id }) {
  const ydoc = useSelector((store) =>
    selectYDocument(store, { id: document_id })
  );
  const [meta, setMeta] = React.useState<any>({});

  React.useEffect(() => {
    if (!ydoc) return;

    function eventHandler(_, __, doc) {
      setMeta(Object.fromEntries(ydoc.getMap("meta") as any));
    }

    ydoc.on("update", eventHandler);
    return () => {
      ydoc.off("update", eventHandler);
    };
  }, [ydoc]);

  return (
    <>
      <Box>
        <TextField
          sx={{ width: "100%" }}
          label="Name"
          variant="outlined"
          name="name"
          onChange={(evt) => {
            ydoc.getMap("meta").set("name", evt.target.value);
          }}
          value={meta.name || ""}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box>
          <FormControlLabel
            control={<Checkbox />}
            value={meta.isPublic}
            label="is public"
            onChange={() => ydoc.getMap("meta").set("isPublic", !meta.isPublic)}
          />
        </Box>
        <Selectable
          name="Line Wrap"
          value={wrap_options.find((option) => option.value === meta.wrap)}
          onChange={({ value }) => {
            ydoc.getMap("meta").set("wrap", value);
          }}
          options={wrap_options}
        />
      </Box>
    </>
  );
}

export default DocumentMetaData;

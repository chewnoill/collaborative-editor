import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Fab } from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { DocumentPublicToggle } from "./document-public-toggle";
import Box from "@mui/system/Box";
import { useSelector } from "react-redux";
import { selectYDocument } from "ducks/appState/y-doc";
import { uploadFilesToYDoc } from "utils/upload-files";
import { useFileUpload } from "hooks/use-file-upload";

function AddFile({ document_id }) {
  const uploadFile = useFileUpload();
  const inputFileRef = React.useRef(null);

  const ydoc = useSelector((store) =>
    selectYDocument(store, { id: document_id })
  );

  function inputFileCallback(event) {
    const files = event.target.files;
    uploadFilesToYDoc(ydoc, files, {
      uploadFn: uploadFile,
    });
  }

  return (
    <MenuItem
      onClick={() => ydoc && inputFileRef.current.click()}
      disabled={!ydoc}
    >
      <input
        ref={inputFileRef}
        type="file"
        onChange={inputFileCallback}
        accept="image/*"
        style={{ display: "none" }}
      />
      Add File
    </MenuItem>
  );
}

export default function DocumentMenu({
  document_id,
  position = "absolute",
  disabled = false,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Fab
        sx={{
          position,
          bottom: 15,
          right: 10,
        }}
        onClick={(event) => {
          handleClick(event);
        }}
        color="primary"
        size="small"
        aria-label="menu"
        disabled={disabled}
      >
        <MoreVertSharpIcon />
      </Fab>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem disabled onClick={handleClose}>
          Edit
        </MenuItem>
        <AddFile document_id={document_id} />
        <MenuItem disabled onClick={handleClose}>
          Delete
        </MenuItem>
        <Box sx={{ marginX: "16px" }}>
          <DocumentPublicToggle document_id={document_id} />
        </Box>
      </Menu>
    </>
  );
}

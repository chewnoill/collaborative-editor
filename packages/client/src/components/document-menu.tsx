import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Fab } from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";
import { DocumentSettings } from "./document-settings";
import { DocumentPublicToggle } from "./document-public-toggle";
import Box from "@mui/system/Box";

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

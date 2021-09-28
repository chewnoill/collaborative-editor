import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Fab } from "@mui/material";
import MoreVertSharpIcon from "@mui/icons-material/MoreVertSharp";

export default function DocumentMenu() {
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
          position: "absolute",
          bottom: 15,
          right: 10,
        }}
        onClick={(event) => {
          handleClick(event);
        }}
        color="primary"
        size="small"
        aria-label="menu"
        disabled
      >
        <MoreVertSharpIcon />
      </Fab>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
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
      </Menu>
    </>
  );
}

"use client";
import React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, TextField, Tooltip } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import { useAuth } from "@/app/component/authProvider";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [courseType, setCourseType] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCourseType(event.target.value as string);
  };

  console.log(isAuthenticated);
  
  return (
    <nav className="flex w-full py-4 z-10 border-b items-center  justify-between border-gray-200">
      <div
        onClick={() => {
          router.push("http://localhost:3000");
        }}
        className="h-full select-none place-content-center pl-8 font-sans text-3xl font-bold text-black hover:cursor-pointer"
      >
        pro<span className="text-blue-600">c</span>ode
      </div>

      <Box className="w-1/4">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Course</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={courseType}
            label="Course"
            onChange={handleChange}
          >
            <MenuItem value={10}>Web development</MenuItem>
            <MenuItem value={20}>Game development</MenuItem>
            <MenuItem value={30}>Others</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField id="outlined-search" label="Find your course" type="search" className={"w-1/4"} />

      <div>
        {!isAuthenticated ? (
          <div className={"mx-4 space-x-8"}>
            <Link href="../login"><Button variant="contained">Log in</Button></Link>
            <Link href="../signup"><Button variant="outlined">Sign up</Button></Link>
          </div>
        ) : (
          <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", marginRight: "10px" }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}
                            aria-controls={open ? "account-menu" : undefined}>
                  <Avatar sx={{ width: 32, height: 32 }} src={user?.avatar}>
                    {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Avatar /> My account
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add another account
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  logout(); // Logout
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
}
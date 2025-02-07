"use client";
import { useAuth } from "@/app/component/authProvider";
import { Logout, ManageSearch, Settings } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getCourseByLabel } from "../api/course";
import { labels } from "../utils/labels";
import Logo from "./logo";
import SearchBox from "./searchBox";
export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [courseType, setCourseType] = React.useState("");

  const handleChange = async (event: SelectChangeEvent) => {
    const selectedLabel = event.target.value;
    setCourseType(selectedLabel); // Store the selected label in state
    setCategory(selectedLabel); // Update the category state

    console.log(selectedLabel);

    // Call the API to fetch courses with the selected label
    try {
      const response = await getCourseByLabel(selectedLabel);
      setCourses(response.data); // Assuming the API returns the list of courses
      console.log(response.data);
      router.push(`/search?kw=&label=${selectedLabel}`);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleNavigateSearchPage = () => {
    router.push(`/search?kw=${keyword}&label=${category}`);
  };
  const handleNavigateManagePage = () => {
    router.push("/teacher/courses");
  };
  const handlenavigate = () => {
    router.push("learning/1/livestream");
  };
  const isTeacher = user?.role === "teacher";

  return (
    <div>
      <nav className="z-10 flex w-full items-center justify-between border-b border-gray-200 py-4">
        <Logo />
        <Box className="w-[200px]">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Course</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={courseType}
              label="Course"
              onChange={handleChange}
            >
              <MenuItem onClick={() => setCategory("")} value={""}>
                Chọn tất cả
              </MenuItem>
              {labels.map((label, idx) => (
                <MenuItem value={label} key={idx}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <div className="flex w-1/3 gap-4">
          <SearchBox setKeyword={setKeyword} />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ textTransform: "none" }}
            onClick={() => {
              handleNavigateSearchPage();
            }}
            className=""
          >
            Search
          </Button>
          {isTeacher && (
            <Button
              variant="contained"
              startIcon={<ManageSearch />}
              sx={{ textTransform: "none" }}
              onClick={handleNavigateManagePage}
            >
              Manage Course
            </Button>
          )}
        </div>
        {isTeacher && (
          <Button
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={handlenavigate}
          >
            LIVE
          </Button>
        )}
        {isAuthenticated && (
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={() => {
              router.push("/chat");
            }}
            className=""
          >
            Chat
          </Button>
        )}

        <div>
          {!isAuthenticated ? (
            <div className={"mx-4 space-x-8"}>
              <Link href="../login">
                <Button variant="contained">Log in</Button>
              </Link>
              <Link href="../signup">
                <Button variant="outlined">Sign up</Button>
              </Link>
            </div>
          ) : (
            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  marginRight: "10px",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                  >
                    <Avatar sx={{ width: 32, height: 32 }} src={user?.email}>
                      {user?.email.charAt(0).toUpperCase()}
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
                <MenuItem
                  onClick={async () => {
                    router.push("/info");
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32 }} /> My account
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
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
    </div>
  );
}

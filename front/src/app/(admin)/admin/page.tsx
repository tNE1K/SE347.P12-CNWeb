"use client";
import AdminTabs from "@/app/component/adminPanel";
import { RoleCheck } from "@/app/component/roleCheck";
import { useAuth } from "@/app/component/authProvider";
import Button from "@mui/material/Button";
import React from "react";

function AdminPage() {
  const { logout } = useAuth();
  return (
    <div className={"flex flex-col"}>
      <Button variant="contained" onClick={logout}>Log out</Button>
      <AdminTabs />
    </div>
  );
}

export default RoleCheck(AdminPage, "admin");

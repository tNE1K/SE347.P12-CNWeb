import React from "react";
import NavBar from "@/app/component/navBar";
import SideBar from "./components/SideMenu";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-row"}>
      <SideBar />
      <div className={"flex w-full flex-col"}>
        {/* <NavBar /> */}
        {children}
      </div>
    </div>
  );
}
